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
        rateLimiter.acquire();
        
        return retryPolicy.execute(() -> {
            return doPublish(article, accessToken);
        });
    }
    
    /**
     * Subclasses implement the actual publishing logic
     */
    protected abstract String doPublish(ArticleResponse article, String accessToken) throws PublicationException;
}
