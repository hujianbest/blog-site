package com.example.writingplatform.publication;

import com.example.writingplatform.dto.ArticleResponse;
import com.example.writingplatform.publication.util.RateLimiter;
import com.example.writingplatform.publication.util.RetryPolicy;
import lombok.extern.slf4j.Slf4j;

/**
 * Abstract base class for platform adapters
 */
@Slf4j
public abstract class BaseAdapter implements PlatformAdapter {
    
    protected final RateLimiter rateLimiter;
    protected final RetryPolicy retryPolicy;
    
    public BaseAdapter(RateLimiter rateLimiter, RetryPolicy retryPolicy) {
        this.rateLimiter = rateLimiter;
        this.retryPolicy = retryPolicy;
    }
    
    @Override
    public String publish(ArticleResponse article, String accessToken) throws PublicationException {
        try {
            rateLimiter.acquire();
            return retryPolicy.execute(() -> {
                try {
                    return doPublish(article, accessToken);
                } catch (Exception e) {
                    throw new RuntimeException("Wrapped exception", e);
                }
            });
        } catch (RateLimiter.RateLimitException | InterruptedException e) {
            log.error("Rate limit exceeded or interrupted", e);
            throw new PublicationException("Rate limit exceeded", e);
        } catch (Exception e) {
            log.error("Publication failed", e);
            throw new PublicationException("Publication failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Subclasses implement the actual publishing logic
     */
    protected abstract String doPublish(ArticleResponse article, String accessToken) throws Exception;
}
