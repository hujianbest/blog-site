package com.example.writingplatform.repository;

import com.example.writingplatform.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    boolean existsByName(String name);

    @Query("SELECT t FROM Tag t LEFT JOIN FETCH t.articles ORDER BY SIZE(t.articles) DESC")
    List<Tag> findAllWithArticleCount();
}
