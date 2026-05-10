package com.example.writingplatform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ArticleRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 500, message = "Title must be less than 500 characters")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String excerpt;

    private String coverImage;

    private Long categoryId;

    private Article.ArticleStatus status = Article.ArticleStatus.DRAFT;

    private Long version;
}
