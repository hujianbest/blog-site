package com.example.writingplatform.controller;

import com.example.writingplatform.dto.ApiResponse;
import com.example.writingplatform.dto.ArticleRequest;
import com.example.writingplatform.dto.ArticleResponse;
import com.example.writingplatform.entity.Article;
import com.example.writingplatform.service.ArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/articles")
@RequiredArgsConstructor
@Tag(name = "Articles", description = "Article management APIs")
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping
    @Operation(summary = "Create a new article")
    public ApiResponse<ArticleResponse> create(
            @Valid @RequestBody ArticleRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        // For demo, use a fixed user ID. In production, extract from JWT
        Long authorId = 1L;
        ArticleResponse response = articleService.create(request, authorId);
        return ApiResponse.success(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get article by ID")
    public ApiResponse<ArticleResponse> getById(@PathVariable Long id) {
        ArticleResponse response = articleService.getById(id);
        return ApiResponse.success(response);
    }

    @GetMapping
    @Operation(summary = "Get all published articles")
    public ApiResponse<List<ArticleResponse>> getAllPublished() {
        List<ArticleResponse> response = articleService.getAllPublished();
        return ApiResponse.success(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Search articles")
    public ApiResponse<List<ArticleResponse>> search(@RequestParam String keyword) {
        List<ArticleResponse> response = articleService.search(keyword);
        return ApiResponse.success(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an article")
    public ApiResponse<ArticleResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ArticleRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long authorId = 1L; // Extract from JWT in production
        ArticleResponse response = articleService.update(id, request, authorId);
        return ApiResponse.success(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an article")
    public ApiResponse<Void> delete(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long authorId = 1L; // Extract from JWT in production
        articleService.delete(id, authorId);
        return ApiResponse.success(null, "Article deleted successfully");
    }
}
