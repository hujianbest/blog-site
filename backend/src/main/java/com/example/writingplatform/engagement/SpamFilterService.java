package com.example.writingplatform.engagement;

import java.util.List;

public class SpamFilterService {
    
    private static final List<String> SPAM_KEYWORDS = List.of(
        "viagra", "casino", "loan", "buy now"
    );
    
    private static final int MAX_LINKS = 3;
    private static final double MAX_UPPERCASE_RATIO = 0.7;
    
    public boolean isSpam(String content) {
        if (content == null || content.trim().isEmpty()) return true;
        
        String lowerContent = content.toLowerCase();
        for (String keyword : SPAM_KEYWORDS) {
            if (lowerContent.contains(keyword)) return true;
        }
        
        int linkCount = countOccurrences(content, "http");
        if (linkCount > MAX_LINKS) return true;
        
        double uppercaseRatio = calculateUppercaseRatio(content);
        if (uppercaseRatio > MAX_UPPERCASE_RATIO) return true;
        
        return false;
    }
    
    private int countOccurrences(String text, String substring) {
        int count = 0, index = 0;
        while ((index = text.indexOf(substring, index)) != -1) {
            count++;
            index += substring.length();
        }
        return count;
    }
    
    private double calculateUppercaseRatio(String text) {
        if (text.length() == 0) return 0;
        int uppercase = 0;
        for (char c : text.toCharArray()) {
            if (Character.isUpperCase(c)) uppercase++;
        }
        return (double) uppercase / text.length();
    }
}
