package com.example.writingplatform.controller;

import com.example.writingplatform.dto.ApiResponse;
import com.example.writingplatform.repository.ArticleRepository;
import com.example.writingplatform.repository.CommentRepository;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/health")
public class HealthController {

    private final ArticleRepository articleRepository;
    private final CommentRepository commentRepository;

    private final Instant startTime = Instant.now();

    public HealthController(ArticleRepository articleRepository, CommentRepository commentRepository) {
        this.articleRepository = articleRepository;
        this.commentRepository = commentRepository;
    }

    @GetMapping
    @Operation(summary = "Health check endpoint")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", Instant.now());
        health.put("uptime", Duration.between(startTime, Instant.now()).getSeconds());

        return ResponseEntity.ok(health);
    }

    @GetMapping("/metrics")
    @Operation(summary = "Get system metrics")
    public ApiResponse<Map<String, Object>> getMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        // Article metrics
        long totalArticles = articleRepository.count();
        metrics.put("totalArticles", totalArticles);

        // Comment metrics
        long totalComments = commentRepository.count();
        metrics.put("totalComments", totalComments);

        // System metrics
        Runtime runtime = Runtime.getRuntime();
        metrics.put("jvm", Map.of(
            "totalMemory", runtime.totalMemory(),
            "freeMemory", runtime.freeMemory(),
            "usedMemory", runtime.totalMemory() - runtime.freeMemory(),
            "maxMemory", runtime.maxMemory(),
            "availableProcessors", runtime.availableProcessors()
        ));

        // Application info
        metrics.put("application", Map.of(
            "name", "writing-platform",
            "version", "0.0.1-SNAPSHOT",
            "uptime", Duration.between(startTime, Instant.now()).getSeconds()
        ));

        return ApiResponse.success(metrics);
    }

    @GetMapping("/ping")
    @Operation(summary = "Simple ping endpoint")
    public ApiResponse<Map<String, String>> ping() {
        Map<String, String> pong = new HashMap<>();
        pong.put("message", "pong");
        pong.put("timestamp", Instant.now().toString());
        return ApiResponse.success(pong);
    }
}
