package com.example.writingplatform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateCommentRequest {
    @NotBlank(message = "Article ID is required")
    private Long articleId;

    @NotBlank(message = "Author name is required")
    @Size(max = 255, message = "Author name must be less than 255 characters")
    private String authorName;

    @NotBlank(message = "Author email is required")
    @Email(message = "Invalid email format")
    private String authorEmail;

    @NotBlank(message = "Content is required")
    @Size(max = 5000, message = "Content must be less than 5000 characters")
    private String content;

    private Long parentId;
}
