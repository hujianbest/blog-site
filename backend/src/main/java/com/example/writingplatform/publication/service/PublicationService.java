package com.example.writingplatform.publication.service;

import com.example.writingplatform.dto.ArticleResponse;
import com.example.writingplatform.exception.ResourceNotFoundException;
import com.example.writingplatform.publication.PlatformAdapter;
import com.example.writingplatform.publication.PublicationException;
import com.example.writingplatform.publication.PublicationStatus;
import com.example.writingplatform.service.ArticleService;
import com.example.writingplatform.service.OAuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class PublicationService {

    private final ArticleService articleService;
    private final OAuthService oauthService;
    private final Map<String, PlatformAdapter> platformAdapters;
    private final Map<Long, List<PublicationStatus>> statusStorage = new ConcurrentHashMap<>();

    public PublicationService(ArticleService articleService, OAuthService oauthService) {
        this.articleService = articleService;
        this.oauthService = oauthService;
        this.platformAdapters = new HashMap<>();
    }

    public Map<String, String> publishArticle(Long articleId, List<String> platforms) {
        Map<String, String> result = new HashMap<>();

        // Get article
        ArticleResponse article = articleService.getById(articleId);

        for (String platform : platforms) {
            String platformKey = platform.toLowerCase();
            PlatformAdapter adapter = platformAdapters.get(platformKey);

            if (adapter == null) {
                result.put(platform, "error: adapter not found");
                log.warn("No adapter found for platform: {}", platform);
                continue;
            }

            try {
                // Get access token from OAuth service
                String accessToken = oauthService.getAccessToken(platform);

                String publishedUrl = adapter.publish(article, accessToken);
                result.put(platform, "success: " + publishedUrl);

                // Store status
                savePublicationStatus(articleId, platform, PublicationStatus.Status.PUBLISHED, publishedUrl);

                log.info("Successfully published article {} to {}", articleId, platform);
            } catch (PublicationException e) {
                result.put(platform, "error: " + e.getMessage());
                savePublicationStatus(articleId, platform, PublicationStatus.Status.FAILED, e.getMessage());
                log.error("Failed to publish article {} to {}: {}", articleId, platform, e.getMessage());
            } catch (IllegalStateException e) {
                result.put(platform, "error: not connected. Please authorize via OAuth first.");
                savePublicationStatus(articleId, platform, PublicationStatus.Status.FAILED, "Not authorized");
                log.error("Platform not authorized: {}", platform);
            }
        }

        return result;
    }

    public List<PublicationStatus> getPublicationStatus(Long articleId) {
        return statusStorage.getOrDefault(articleId, Collections.emptyList());
    }

    private void savePublicationStatus(Long articleId, String platform, PublicationStatus.Status status, String message) {
        PublicationStatus publicationStatus = new PublicationStatus();
        publicationStatus.setArticleId(articleId);
        publicationStatus.setPlatform(platform);
        publicationStatus.setStatus(status);
        publicationStatus.setMessage(message);
        publicationStatus.setPublishedAt(new Date());

        statusStorage.computeIfAbsent(articleId, k -> new ArrayList<>()).add(publicationStatus);
    }
}
