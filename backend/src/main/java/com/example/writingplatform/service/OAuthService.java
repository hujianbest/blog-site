package com.example.writingplatform.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class OAuthService {

    // In-memory storage for OAuth tokens (TODO: move to database)
    private final Map<String, OAuthToken> tokenStorage = new HashMap<>();

    // OAuth configuration for different platforms
    private static final Map<String, OAuthConfig> PLATFORM_CONFIGS = new HashMap<>();

    static {
        // Zhihu OAuth configuration
        PLATFORM_CONFIGS.put("zhihu", new OAuthConfig(
            "zhihu",
            "https://www.zhihu.com/oauth2/authorize",
            "https://www.zhihu.com/oauth2/token",
            "your_zhihu_client_id", // TODO: Move to application properties
            "your_zhihu_client_secret"
        ));

        // Twitter OAuth configuration
        PLATFORM_CONFIGS.put("twitter", new OAuthConfig(
            "twitter",
            "https://twitter.com/i/oauth2/authorize",
            "https://api.twitter.com/2/oauth2/token",
            "your_twitter_client_id",
            "your_twitter_client_secret"
        ));
    }

    public Map<String, String> getAuthorizationUrl(String platform) {
        String platformKey = platform.toLowerCase();
        OAuthConfig config = PLATFORM_CONFIGS.get(platformKey);

        if (config == null) {
            throw new IllegalArgumentException("Unsupported platform: " + platform);
        }

        String state = generateState();
        String authUrl = config.authorizationUrl +
            "?client_id=" + config.clientId +
            "&response_type=code" +
            "&redirect_uri=" + getRedirectUri(platformKey) +
            "&scope=" + getScopes(platformKey) +
            "&state=" + state;

        // Store state for verification
        tokenStorage.put(state, new OAuthToken(platformKey, state, null, System.currentTimeMillis()));

        Map<String, String> result = new HashMap<>();
        result.put("authorizationUrl", authUrl);
        result.put("state", state);
        return result;
    }

    public Map<String, String> handleCallback(String platform, String code, String state) {
        String platformKey = platform.toLowerCase();

        // Verify state
        OAuthToken stateToken = tokenStorage.get(state);
        if (stateToken == null || !stateToken.platform.equals(platformKey)) {
            throw new IllegalArgumentException("Invalid state parameter");
        }

        // Clean up state token
        tokenStorage.remove(state);

        // TODO: Exchange code for access token
        // For now, mock the token exchange
        String accessToken = "mock_access_token_" + platformKey + "_" + System.currentTimeMillis();
        String refreshToken = "mock_refresh_token_" + platformKey + "_" + System.currentTimeMillis();

        // Store tokens
        String tokenKey = platformKey + ":user";
        tokenStorage.put(tokenKey, new OAuthToken(platformKey, accessToken, refreshToken, System.currentTimeMillis()));

        log.info("OAuth callback successful for platform: {}", platformKey);

        Map<String, String> result = new HashMap<>();
        result.put("status", "success");
        result.put("platform", platformKey);
        result.put("accessToken", accessToken);
        return result;
    }

    public Map<String, Object> getConnectionStatus(String platform) {
        String platformKey = platform.toLowerCase();
        String tokenKey = platformKey + ":user";
        OAuthToken token = tokenStorage.get(tokenKey);

        Map<String, Object> result = new HashMap<>();
        result.put("platform", platformKey);
        result.put("connected", token != null && token.accessToken != null);

        if (token != null) {
            result.put("connectedAt", token.timestamp);
        }

        return result;
    }

    public void disconnect(String platform) {
        String platformKey = platform.toLowerCase();
        String tokenKey = platformKey + ":user";
        tokenStorage.remove(tokenKey);
        log.info("Disconnected platform: {}", platformKey);
    }

    public String getAccessToken(String platform) {
        String platformKey = platform.toLowerCase();
        String tokenKey = platformKey + ":user";
        OAuthToken token = tokenStorage.get(tokenKey);

        if (token == null || token.accessToken == null) {
            throw new IllegalStateException("No access token found for platform: " + platform);
        }

        return token.accessToken;
    }

    private String generateState() {
        return "state_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 10000);
    }

    private String getRedirectUri(String platform) {
        // TODO: Move to application properties
        return "http://localhost:8080/v1/oauth/" + platform + "/callback";
    }

    private String getScopes(String platform) {
        return switch (platform) {
            case "zhihu" -> "article.write";
            case "twitter" -> "tweet.read tweet.write users.read";
            default -> "";
        };
    }

    private static record OAuthConfig(
        String platform,
        String authorizationUrl,
        String tokenUrl,
        String clientId,
        String clientSecret
    ) {}

    private static record OAuthToken(
        String platform,
        String accessToken,
        String refreshToken,
        long timestamp
    ) {}
}
