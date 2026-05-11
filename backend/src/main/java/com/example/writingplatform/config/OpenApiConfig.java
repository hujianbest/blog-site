package com.example.writingplatform.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI writingPlatformOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Writing Platform API")
                        .description("Personal Writing Platform Backend API Documentation")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Writing Platform Team")
                                .email("contact@example.com")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080/api")
                                .description("Development Server")));
    }
}
