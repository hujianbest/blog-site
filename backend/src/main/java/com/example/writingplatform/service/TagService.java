package com.example.writingplatform.service;

import com.example.writingplatform.dto.ArticleResponse;
import com.example.writingplatform.dto.TagDto;
import com.example.writingplatform.entity.Article;
import com.example.writingplatform.entity.Tag;
import com.example.writingplatform.exception.ResourceNotFoundException;
import com.example.writingplatform.repository.ArticleRepository;
import com.example.writingplatform.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final ArticleRepository articleRepository;

    public List<TagDto> getAll() {
        return tagRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TagDto getById(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found"));
        return convertToDto(tag);
    }

    public List<ArticleResponse> getArticlesByTagName(String name) {
        List<Article> articles = articleRepository.findByTagName(name);
        return articles.stream()
                .map(this::convertArticleToDto)
                .collect(Collectors.toList());
    }

    public TagDto create(String name) {
        Tag tag = new Tag();
        tag.setName(name);
        tag = tagRepository.save(tag);
        return convertToDto(tag);
    }

    private TagDto convertToDto(Tag tag) {
        return new TagDto(
                tag.getId(),
                tag.getName(),
                tag.getCreatedAt()
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
