package com.example.writingplatform.publication;

import com.example.writingplatform.dto.ArticleResponse;

/**
 * Interface for platform-specific publication adapters
 */
public interface PlatformAdapter {
    
    /**
     * Publish an article to the platform
     */
    String publish(ArticleResponse article, String accessToken) throws PublicationException;
    
    /**
     * Get the platform name
     */
    String getPlatformName();
    
    /**
     * Validate the access token
     */
    boolean validateToken(String accessToken);
}
