package com.example.writingplatform.controller;

import com.example.writingplatform.dto.ArticleRequest;
import com.example.writingplatform.dto.ArticleResponse;
import com.example.writingplatform.entity.Article;
import com.example.writingplatform.service.ArticleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ArticleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ArticleService articleService;

    private ArticleResponse articleResponse;

    @BeforeEach
    void setUp() {
        articleResponse = new ArticleResponse(
                1L,
                "Test Article",
                "Test Content",
                "Test Excerpt",
                null,
                Article.ArticleStatus.PUBLISHED,
                1L,
                "Test Author",
                null,
                null,
                List.of(),
                0,
                0,
                java.time.LocalDateTime.now(),
                java.time.LocalDateTime.now(),
                java.time.LocalDateTime.now()
        );
    }

    @Test
    void getAllArticles_ShouldReturnArticles() throws Exception {
        when(articleService.getAllPublished()).thenReturn(Arrays.asList(articleResponse));

        mockMvc.perform(get("/v1/articles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void getArticleById_ShouldReturnArticle() throws Exception {
        when(articleService.getById(1L)).thenReturn(articleResponse);

        mockMvc.perform(get("/v1/articles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Test Article"));
    }
}
