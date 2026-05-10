package com.example.writingplatform.repository;

import com.example.writingplatform.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findByAuthorIdAndStatusAndDeletedAtIsNull(
        Long authorId,
        Article.ArticleStatus status
    );

    List<Article> findByStatusAndDeletedAtIsNullOrderByCreatedAtDesc(
        Article.ArticleStatus status
    );

    @Query("SELECT a FROM Article a WHERE a.status = :status AND a.deletedAt IS NULL AND " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Article> searchByKeyword(@Param("keyword") String keyword, @Param("status") Article.ArticleStatus status);

    @Query("SELECT a FROM Article a JOIN a.tags t WHERE t.name = :tagName AND a.deletedAt IS NULL")
    List<Article> findByTagName(@Param("tagName") String tagName);

    List<Article> findByCategoryIdAndDeletedAtIsNull(Long categoryId);

    @Query("SELECT a FROM Article a WHERE a.deletedAt IS NULL")
    Page<Article> findAllActive(Pageable pageable);
}
