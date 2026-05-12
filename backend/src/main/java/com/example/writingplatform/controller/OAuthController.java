package com.example.writingplatform.controller;

import com.example.writingplatform.dto.ApiResponse;
import com.example.writingplatform.service.OAuthService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/oauth")
@RequiredArgsConstructor
public class OAuthController {

    private final OAuthService oauthService;

    @GetMapping("/{platform}/authorize")
    @Operation(summary = "Get OAuth authorization URL")
    public ApiResponse<Map<String, String>> getAuthorizationUrl(@PathVariable String platform) {
        Map<String, String> result = oauthService.getAuthorizationUrl(platform);
        return ApiResponse.success(result);
    }

    @PostMapping("/{platform}/callback")
    @Operation(summary = "Handle OAuth callback")
    public ApiResponse<Map<String, String>> handleCallback(
            @PathVariable String platform,
            @RequestParam String code,
            @RequestParam(required = false) String state) {
        Map<String, String> result = oauthService.handleCallback(platform, code, state);
        return ApiResponse.success(result);
    }

    @GetMapping("/{platform}/status")
    @Operation(summary = "Check OAuth connection status")
    public ApiResponse<Map<String, Object>> getConnectionStatus(@PathVariable String platform) {
        Map<String, Object> result = oauthService.getConnectionStatus(platform);
        return ApiResponse.success(result);
    }

    @DeleteMapping("/{platform}/disconnect")
    @Operation(summary = "Disconnect OAuth connection")
    public ApiResponse<Void> disconnect(@PathVariable String platform) {
        oauthService.disconnect(platform);
        return ApiResponse.success(null, "Disconnected successfully");
    }
}
