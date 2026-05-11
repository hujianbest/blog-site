package com.example.writingplatform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "article_id", nullable = false)
    private Long articleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id", insertable = false, updatable = false)
    private Article article;

    @Column(name = "author_name", nullable = false, length = 255)
    private String authorName;

    @Column(name = "author_email", nullable = false, length = 255)
    private String authorEmail;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "parent_id")
    private Long parentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", insertable = false, updatable = false)
    private Comment parent;

    @OneToMany(mappedBy = "parent")
    private List<Comment> replies = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CommentStatus status = CommentStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum CommentStatus {
        PENDING,
        APPROVED,
        SPAM
    }
}
