package com.example.writingplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageUploadResponse {
    private Long id;
    private String url;
    private String thumbnailUrl;
    private Long size;
    private Integer width;
    private Integer height;
}
