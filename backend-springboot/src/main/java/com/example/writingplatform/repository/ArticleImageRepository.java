package com.example.writingplatform.repository;

import com.example.writingplatform.entity.ArticleImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleImageRepository extends JpaRepository<ArticleImage, Long> {
    List<ArticleImage> findByArticleIdOrderByUploadOrderAsc(Long articleId);
}
