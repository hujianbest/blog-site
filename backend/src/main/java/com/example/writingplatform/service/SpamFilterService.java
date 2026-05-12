package com.example.writingplatform.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class SpamFilterService {

    // Common spam keywords
    private static final Set<String> SPAM_KEYWORDS = Set.of(
        "viagra", "cialis", "casino", "poker", "gambling",
        "buy now", "click here", "free money", "winner",
        "lottery", "xxx", "porn", "sex", "hot girls",
        "make money", "work from home", "get rich",
        "loan", "credit card", "debt", "insurance",
        "buy cheap", "best price", "online pharmacy",
        "SEO", "backlink", "page rank", "alexa"
    );

    // Maximum number of links allowed in a comment
    private static final int MAX_LINKS = 3;

    // Rate limiting: max comments per minute per email
    private static final int MAX_COMMENTS_PER_MINUTE = 3;

    // Rate limiting storage
    private final ConcurrentHashMap<String, RateLimitEntry> rateLimitStorage = new ConcurrentHashMap<>();

    /**
     * Check if a comment is spam
     */
    public SpamCheckResult checkSpam(String authorEmail, String content) {
        // Check rate limiting
        if (isRateLimited(authorEmail)) {
            log.warn("Rate limit exceeded for email: {}", authorEmail);
            return new SpamCheckResult(true, "提交过于频繁，请稍后再试");
        }

        // Check for spam keywords
        String lowerContent = content.toLowerCase();
        for (String keyword : SPAM_KEYWORDS) {
            if (lowerContent.contains(keyword)) {
                log.warn("Spam keyword detected: {}", keyword);
                return new SpamCheckResult(true, "评论包含违规内容");
            }
        }

        // Check for excessive links
        int linkCount = countLinks(content);
        if (linkCount > MAX_LINKS) {
            log.warn("Too many links in comment: {}", linkCount);
            return new SpamCheckResult(true, "评论包含过多链接");
        }

        // Check for suspicious patterns (repeated characters)
        if (hasRepeatedCharacters(content)) {
            log.warn("Suspicious pattern detected in comment");
            return new SpamCheckResult(true, "评论格式异常");
        }

        // Check minimum length
        if (content.trim().length() < 5) {
            return new SpamCheckResult(true, "评论内容过短");
        }

        // Check maximum length
        if (content.length() > 5000) {
            return new SpamCheckResult(true, "评论内容过长");
        }

        // Record submission for rate limiting
        recordSubmission(authorEmail);

        return new SpamCheckResult(false, null);
    }

    /**
     * Check if email is rate limited
     */
    private boolean isRateLimited(String email) {
        RateLimitEntry entry = rateLimitStorage.get(email);
        if (entry == null) {
            return false;
        }

        long now = System.currentTimeMillis();
        long oneMinuteAgo = now - 60 * 1000;

        // Remove old submissions
        entry.submissionTimes.removeIf(time -> time < oneMinuteAgo);

        return entry.submissionTimes.size() >= MAX_COMMENTS_PER_MINUTE;
    }

    /**
     * Record a comment submission for rate limiting
     */
    private void recordSubmission(String email) {
        rateLimitStorage.computeIfAbsent(email, k -> new RateLimitEntry())
            .submissionTimes.add(System.currentTimeMillis());
    }

    /**
     * Count the number of links in the content
     */
    private int countLinks(String content) {
        // Count http:// and https:// patterns
        int count = 0;
        int index = 0;

        while ((index = content.indexOf("http", index)) != -1) {
            count++;
            index += 4;
        }

        return count;
    }

    /**
     * Check for repeated characters (e.g., "aaaaa", "!!!!")
     */
    private boolean hasRepeatedCharacters(String content) {
        // Check for 5 or more consecutive identical characters
        for (int i = 0; i < content.length() - 4; i++) {
            char c = content.charAt(i);
            boolean allSame = true;

            for (int j = 1; j < 5; j++) {
                if (content.charAt(i + j) != c) {
                    allSame = false;
                    break;
                }
            }

            if (allSame) {
                return true;
            }
        }

        return false;
    }

    private static class RateLimitEntry {
        final Set<Long> submissionTimes = ConcurrentHashMap.newKeySet();
    }

    public record SpamCheckResult(
        boolean isSpam,
        String reason
    ) {}
}
