package com.example.writingplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleResponse {
    private Long id;
    private String title;
    private String content;
    private String excerpt;
    private String coverImage;
    private Article.ArticleStatus status;
    private Long authorId;
    private String authorName;
    private Long categoryId;
    private String categoryName;
    private List<TagDto> tags;
    private Integer viewCount;
    private Integer version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
}
