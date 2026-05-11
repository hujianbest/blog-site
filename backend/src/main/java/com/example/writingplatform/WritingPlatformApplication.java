package com.example.writingplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WritingPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(WritingPlatformApplication.class, args);
        System.out.println("Writing Platform Backend is running!");
        System.out.println("H2 Console: http://localhost:8080/api/h2-console");
        System.out.println("Swagger UI: http://localhost:8080/api/swagger-ui.html");
    }
}
