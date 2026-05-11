package com.example.writingplatform.publication;

import lombok.Data;

@Data
public class PublicationStatus {
    private String platform;
    private String status; // pending, success, failed
    private String message;
    private String publishedUrl;
}
