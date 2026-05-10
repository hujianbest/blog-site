package com.example.writingplatform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CommentDto {
    private Long id;
    private Long articleId;
    private String authorName;
    private String authorEmail;
    private String content;
    private Long parentId;
    private Comment.CommentStatus status;
    private LocalDateTime createdAt;
    private List<CommentDto> replies;
}
