package com.example.writingplatform.repository;

import com.example.writingplatform.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByArticleIdAndParentIdIsNullAndStatusOrderByCreatedAtAsc(
        Long articleId,
        Comment.CommentStatus status
    );

    List<Comment> findByArticleIdAndParentIdIsNullOrderByCreatedAtAsc(Long articleId);

    List<Comment> findByParentIdOrderByCreatedAtAsc(Long parentId);
}
