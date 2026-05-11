package com.example.writingplatform.controller;

import com.example.writingplatform.dto.ApiResponse;
import com.example.writingplatform.dto.ArticleResponse;
import com.example.writingplatform.dto.CategoryDto;
import com.example.writingplatform.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Category management APIs")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get all categories")
    public ApiResponse<List<CategoryDto>> getAll() {
        List<CategoryDto> response = categoryService.getTree();
        return ApiResponse.success(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID")
    public ApiResponse<CategoryDto> getById(@PathVariable Long id) {
        CategoryDto response = categoryService.getById(id);
        return ApiResponse.success(response);
    }

    @GetMapping("/{id}/articles")
    @Operation(summary = "Get articles by category ID")
    public ApiResponse<List<ArticleResponse>> getArticlesByCategoryId(@PathVariable Long id) {
        List<ArticleResponse> response = categoryService.getArticlesByCategoryId(id);
        return ApiResponse.success(response);
    }

    @PostMapping
    @Operation(summary = "Create a new category")
    public ApiResponse<CategoryDto> create(
            @RequestParam String name,
            @RequestParam(required = false) Long parentId) {
        CategoryDto response = categoryService.create(name, parentId);
        return ApiResponse.success(response);
    }
}
