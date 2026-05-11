package com.example.writingplatform.publication;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "platform")
public class PlatformConfig {
    
    private ZhihuConfig zhihu = new ZhihuConfig();
    private TwitterConfig twitter = new TwitterConfig();
    
    @Data
    public static class ZhihuConfig {
        private String clientId;
        private String clientSecret;
        private String redirectUri;
        private String authUrl = "https://www.zhihu.com/oauth2/authorize";
        private String tokenUrl = "https://www.zhihu.com/oauth2/access_token";
    }
    
    @Data
    public static class TwitterConfig {
        private String clientId;
        private String clientSecret;
        private String redirectUri;
        private String authUrl = "https://twitter.com/i/oauth2/authorize";
        private String tokenUrl = "https://api.twitter.com/2/oauth2/token";
    }
}
