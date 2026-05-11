package com.example.writingplatform.publication.util;

/**
 * Rate limiter for API calls
 */
public class RateLimiter {
    
    private final int maxRequests;
    private final long timeWindowMillis;
    private long[] requestTimestamps;
    private int index = 0;
    
    public RateLimiter(int maxRequests, int timeWindowSeconds) {
        this.maxRequests = maxRequests;
        this.timeWindowMillis = timeWindowSeconds * 1000L;
        this.requestTimestamps = new long[maxRequests];
    }
    
    public synchronized void acquire() throws RateLimitException {
        long now = System.currentTimeMillis();
        
        // Check if we've exceeded the rate limit
        if (index >= maxRequests) {
            long oldestTimestamp = requestTimestamps[0];
            if (now - oldestTimestamp < timeWindowMillis) {
                throw new RateLimitException("Rate limit exceeded");
            }
            // Shift the window
            System.arraycopy(requestTimestamps, 1, requestTimestamps, 0, maxRequests - 1);
            index--;
        }
        
        requestTimestamps[index++] = now;
    }
    
    public static class RateLimitException extends Exception {
        public RateLimitException(String message) {
            super(message);
        }
    }
}
