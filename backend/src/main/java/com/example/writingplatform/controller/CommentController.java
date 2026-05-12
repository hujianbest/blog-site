package com.example.writingplatform.controller;

import com.example.writingplatform.dto.ApiResponse;
import com.example.writingplatform.dto.CommentDto;
import com.example.writingplatform.dto.CreateCommentRequest;
import com.example.writingplatform.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/articles/{articleId}/comments")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Comment management APIs")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    @Operation(summary = "Create a new comment")
    public ApiResponse<CommentDto> createComment(@Valid @RequestBody CreateCommentRequest request) {
        CommentDto response = commentService.create(request);
        return ApiResponse.success(response);
    }

    @GetMapping
    @Operation(summary = "Get comments for an article")
    public ApiResponse<List<CommentDto>> getComments(@PathVariable Long articleId) {
        List<CommentDto> response = commentService.getCommentsByArticleId(articleId);
        return ApiResponse.success(response);
    }

    @GetMapping("/{commentId}/replies")
    @Operation(summary = "Get replies for a comment")
    public ApiResponse<List<CommentDto>> getReplies(@PathVariable Long commentId) {
        List<CommentDto> response = commentService.getReplies(commentId);
        return ApiResponse.success(response);
    }

    @PutMapping("/{commentId}/approve")
    @Operation(summary = "Approve a comment")
    public ApiResponse<CommentDto> approveComment(@PathVariable Long commentId) {
        CommentDto response = commentService.approve(commentId);
        return ApiResponse.success(response);
    }

    @DeleteMapping("/{commentId}")
    @Operation(summary = "Delete a comment")
    public ApiResponse<Void> deleteComment(@PathVariable Long commentId) {
        commentService.delete(commentId);
        return ApiResponse.success(null, "Comment deleted successfully");
    }
}
