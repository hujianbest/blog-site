package com.example.writingplatform.publication;

import com.example.writingplatform.dto.ApiResponse;
import com.example.writingplatform.dto.ArticleResponse;
import com.example.writingplatform.publication.service.PublicationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/publications")
@RequiredArgsConstructor
public class PublicationController {
    
    private final PublicationService publicationService;
    
    @PostMapping("/articles/{articleId}")
    @Operation(summary = "Publish article to platforms")
    public ApiResponse<Map<String, String>> publishToPlatforms(
            @PathVariable Long articleId,
            @RequestBody List<String> platforms) {
        Map<String, String> result = publicationService.publishArticle(articleId, platforms);
        return ApiResponse.success(result);
    }
    
    @GetMapping("/articles/{articleId}/status")
    @Operation(summary = "Get publication status")
    public ApiResponse<List<PublicationStatus>> getStatus(@PathVariable Long articleId) {
        List<PublicationStatus> status = publicationService.getPublicationStatus(articleId);
        return ApiResponse.success(status);
    }
}
