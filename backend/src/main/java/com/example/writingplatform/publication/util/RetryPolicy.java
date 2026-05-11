package com.example.writingplatform.publication.util;

import java.util.function.Supplier;

/**
 * Retry policy with exponential backoff
 */
public class RetryPolicy {
    
    private final int maxRetries;
    private final long baseDelayMillis;
    
    public RetryPolicy(int maxRetries, long baseDelayMillis) {
        this.maxRetries = maxRetries;
        this.baseDelayMillis = baseDelayMillis;
    }
    
    public <T> T execute(Supplier<T> operation) throws Exception {
        Exception lastException = null;
        
        for (int attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return operation.get();
            } catch (Exception e) {
                lastException = e;
                if (attempt < maxRetries) {
                    long delay = baseDelayMillis * (1L << attempt);
                    Thread.sleep(delay);
                }
            }
        }
        
        throw new Exception("Operation failed after " + (maxRetries + 1) + " attempts", lastException);
    }
}
