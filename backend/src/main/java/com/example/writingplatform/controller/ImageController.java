package com.example.writingplatform.controller;

import com.example.writingplatform.dto.ApiResponse;
import com.example.writingplatform.dto.ImageUploadResponse;
import com.example.writingplatform.service.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/v1/images")
@RequiredArgsConstructor
@Tag(name = "Images", description = "Image management APIs")
public class ImageController {

    private final ImageService imageService;

    @PostMapping("/upload")
    @Operation(summary = "Upload an image")
    public ApiResponse<ImageUploadResponse> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "articleId", required = false) Long articleId) {
        ImageUploadResponse response = imageService.uploadImage(file, articleId);
        return ApiResponse.success(response);
    }

    @GetMapping("/article/{articleId}")
    @Operation(summary = "Get images for an article")
    public ApiResponse<List<ImageUploadResponse>> getArticleImages(@PathVariable Long articleId) {
        List<ImageUploadResponse> response = imageService.getArticleImages(articleId);
        return ApiResponse.success(response);
    }

    @DeleteMapping("/{imageId}")
    @Operation(summary = "Delete an image")
    public ApiResponse<Void> deleteImage(
            @PathVariable Long imageId,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long userId = 1L; // Extract from JWT
        imageService.deleteImage(imageId, userId);
        return ApiResponse.success(null, "Image deleted successfully");
    }
}
