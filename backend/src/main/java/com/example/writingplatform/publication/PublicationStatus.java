package com.example.writingplatform.publication;

import lombok.Data;

import java.util.Date;

@Data
public class PublicationStatus {
    private Long articleId;
    private String platform;
    private Status status;
    private String message;
    private Date publishedAt;

    public enum Status {
        PENDING,
        PUBLISHED,
        FAILED
    }
}
