package com.example.writingplatform.service;

import com.example.writingplatform.dto.ArticleResponse;
import com.example.writingplatform.dto.CategoryDto;
import com.example.writingplatform.dto.TagDto;
import com.example.writingplatform.entity.Article;
import com.example.writingplatform.entity.Category;
import com.example.writingplatform.exception.ResourceNotFoundException;
import com.example.writingplatform.repository.ArticleRepository;
import com.example.writingplatform.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ArticleRepository articleRepository;

    public CategoryDto getById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return convertToDto(category);
    }

    public List<CategoryDto> getTree() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ArticleResponse> getArticlesByCategoryId(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found");
        }
        List<Article> articles = articleRepository.findByCategoryIdAndDeletedAtIsNull(id);
        return articles.stream()
                .map(this::convertArticleToDto)
                .collect(Collectors.toList());
    }

    public CategoryDto create(String name, Long parentId) {
        Category category = new Category();
        category.setName(name);
        category.setParentId(parentId);
        category = categoryRepository.save(category);
        return convertToDto(category);
    }

    private CategoryDto convertToDto(Category category) {
        return new CategoryDto(
                category.getId(),
                category.getName(),
                category.getParentId(),
                null,
                List.of(),
                0,
                category.getCreatedAt()
        );
    }

    private ArticleResponse convertArticleToDto(Article article) {
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
                        .map(tag -> new TagDto(tag.getId(), tag.getName(), tag.getCreatedAt()))
                        .collect(Collectors.toList()),
                article.getViewCount(),
                article.getVersion(),
                article.getCreatedAt(),
                article.getUpdatedAt(),
                article.getPublishedAt()
        );
    }
}
