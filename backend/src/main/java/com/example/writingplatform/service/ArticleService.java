package com.example.writingplatform.service;

import com.example.writingplatform.dto.ArticleRequest;
import com.example.writingplatform.dto.ArticleResponse;
import com.example.writingplatform.entity.Article;
import com.example.writingplatform.entity.Category;
import com.example.writingplatform.entity.Tag;
import com.example.writingplatform.entity.User;
import com.example.writingplatform.exception.OptimisticLockException;
import com.example.writingplatform.exception.ResourceNotFoundException;
import com.example.writingplatform.repository.ArticleRepository;
import com.example.writingplatform.repository.CategoryRepository;
import com.example.writingplatform.repository.TagRepository;
import com.example.writingplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    @Transactional
    public ArticleResponse create(ArticleRequest request, Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setExcerpt(request.getExcerpt());
        article.setCoverImage(request.getCoverImage());
        article.setStatus(request.getStatus());
        article.setAuthorId(authorId);
        article.setAuthor(author);
        article.setVersion(0);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            article.setCategory(category);
            article.setCategoryId(category.getId());
        }

        if (request.getStatus() == Article.ArticleStatus.PUBLISHED) {
            article.setPublishedAt(LocalDateTime.now());
        }

        article = articleRepository.save(article);

        return convertToResponse(article);
    }

    @Transactional
    public ArticleResponse update(Long id, ArticleRequest request, Long authorId) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));

        // Check version for optimistic locking
        if (!article.getVersion().equals(request.getVersion())) {
            throw new OptimisticLockException("Article was modified by another user");
        }

        // Check ownership
        if (!article.getAuthorId().equals(authorId)) {
            throw new ResourceNotFoundException("Article not found");
        }

        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setExcerpt(request.getExcerpt());
        article.setCoverImage(request.getCoverImage());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElse(null);
            article.setCategory(category);
            article.setCategoryId(category != null ? category.getId() : null);
        }

        // Update published date if status changes to published
        if (request.getStatus() == Article.ArticleStatus.PUBLISHED &&
            article.getStatus() != Article.ArticleStatus.PUBLISHED) {
            article.setPublishedAt(LocalDateTime.now());
        }
        article.setStatus(request.getStatus());

        article.setVersion(article.getVersion() + 1);

        article = articleRepository.save(article);

        return convertToResponse(article);
    }

    public ArticleResponse getById(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));

        // Increment view count
        article.setViewCount((article.getViewCount() != null ? article.getViewCount() : 0) + 1);
        articleRepository.save(article);

        return convertToResponse(article);
    }

    public List<ArticleResponse> getAllPublished() {
        return articleRepository.findByStatusAndDeletedAtIsNullOrderByCreatedAtDesc(
                Article.ArticleStatus.PUBLISHED
        ).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ArticleResponse> getByAuthor(Long authorId) {
        return articleRepository.findByAuthorIdAndStatusAndDeletedAtIsNull(
                authorId,
                Article.ArticleStatus.PUBLISHED
        ).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ArticleResponse> search(String keyword) {
        return articleRepository.searchByKeyword(keyword, Article.ArticleStatus.PUBLISHED)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ArticleResponse> getRelatedArticles(Long articleId, int limit) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));

        // Try to find articles by same category first
        List<Article> relatedArticles;
        if (article.getCategoryId() != null) {
            relatedArticles = articleRepository
                    .findByCategoryIdAndIdNotAndStatusAndDeletedAtIsNullOrderByCreatedAtDesc(
                            article.getCategoryId(),
                            articleId,
                            Article.ArticleStatus.PUBLISHED
                    );
        } else {
            // If no category, find by tags
            relatedArticles = articleRepository
                    .findByTagsInAndIdNotAndStatusAndDeletedAtIsNullOrderByCreatedAtDesc(
                            article.getTags(),
                            articleId,
                            Article.ArticleStatus.PUBLISHED
                    );
        }

        // Limit results
        return relatedArticles.stream()
                .limit(limit)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void incrementViewCount(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));
        article.setViewCount((article.getViewCount() != null ? article.getViewCount() : 0) + 1);
        articleRepository.save(article);
    }

    @Transactional
    public void delete(Long id, Long authorId) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));

        if (!article.getAuthorId().equals(authorId)) {
            throw new ResourceNotFoundException("Article not found");
        }

        // Soft delete
        article.setDeletedAt(LocalDateTime.now());
        articleRepository.save(article);
    }

    private ArticleResponse convertToResponse(Article article) {
        return new ArticleResponse(
                article.getId(),
                article.getTitle(),
                article.getContent(),
                article.getExcerpt(),
                article.getCoverImage(),
                article.getStatus(),
                article.getAuthorId(),
                article.getAuthor() != null ? article.getAuthor().getName() : null,
                article.getCategoryId(),
                article.getCategory() != null ? article.getCategory().getName() : null,
                article.getTags().stream()
                        .map(tag -> new com.example.writingplatform.dto.TagDto(
                                tag.getId(),
                                tag.getName(),
                                tag.getCreatedAt()
                        ))
                        .collect(Collectors.toList()),
                article.getViewCount(),
                article.getVersion(),
                article.getCreatedAt(),
                article.getUpdatedAt(),
                article.getPublishedAt()
        );
    }
}
