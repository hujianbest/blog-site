package com.example.writingplatform.service;

import com.example.writingplatform.dto.ImageUploadResponse;
import com.example.writingplatform.entity.ArticleImage;
import com.example.writingplatform.exception.ResourceNotFoundException;
import com.example.writingplatform.repository.ArticleImageRepository;
import com.example.writingplatform.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    private final ArticleImageRepository articleImageRepository;
    private final ArticleRepository articleRepository;

    @Transactional
    public ImageUploadResponse uploadImage(MultipartFile file, Long articleId) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ?
                originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String filename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            // Get file dimensions if it's an image
            Integer width = null;
            Integer height = null;
            // TODO: Use ImageIO or similar to get dimensions

            // Create database record
            ArticleImage image = new ArticleImage();
            image.setArticleId(articleId);
            image.setFilename(originalFilename != null ? originalFilename : filename);
            image.setUrl("/uploads/" + filename);
            image.setThumbnailUrl("/uploads/" + filename); // TODO: Generate thumbnail
            image.setFileSize(file.getSize());
            image.setMimeType(file.getContentType());

            image = articleImageRepository.save(image);

            return new ImageUploadResponse(
                image.getId(),
                image.getUrl(),
                image.getThumbnailUrl(),
                file.getSize(),
                width,
                height
            );

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    public List<ImageUploadResponse> getArticleImages(Long articleId) {
        return articleImageRepository.findByArticleIdOrderByUploadOrderAsc(articleId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional
    public void deleteImage(Long imageId, Long userId) {
        ArticleImage image = articleImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));

        // Check ownership through article
        var article = articleRepository.findById(image.getArticleId())
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));

        if (!article.getAuthorId().equals(userId)) {
            throw new ResourceNotFoundException("Image not found");
        }

        // Delete file from filesystem
        try {
            Path filePath = Paths.get(uploadDir, image.getFilename());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log but continue with database deletion
            System.err.println("Failed to delete file: " + e.getMessage());
        }

        // Delete database record
        articleImageRepository.delete(image);
    }

    private ImageUploadResponse convertToResponse(ArticleImage image) {
        return new ImageUploadResponse(
            image.getId(),
            image.getUrl(),
            image.getThumbnailUrl(),
            image.getFileSize(),
            image.getWidth(),
            image.getHeight()
        );
    }
}
