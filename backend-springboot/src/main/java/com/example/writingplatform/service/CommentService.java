package com.example.writingplatform.service;

import com.example.writingplatform.dto.CommentDto;
import com.example.writingplatform.dto.CreateCommentRequest;
import com.example.writingplatform.entity.Article;
import com.example.writingplatform.entity.Comment;
import com.example.writingplatform.exception.ResourceNotFoundException;
import com.example.writingplatform.repository.ArticleRepository;
import com.example.writingplatform.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;

    @Transactional
    public CommentDto create(CreateCommentRequest request) {
        // Verify article exists
        Article article = articleRepository.findById(request.getArticleId())
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));

        Comment comment = new Comment();
        comment.setArticleId(request.getArticleId());
        comment.setArticle(article);
        comment.setAuthorName(request.getAuthorName());
        comment.setAuthorEmail(request.getAuthorEmail());
        comment.setContent(request.getContent());
        comment.setParentId(request.getParentId());
        comment.setStatus(Comment.CommentStatus.PENDING);

        comment = commentRepository.save(comment);

        return convertToDto(comment);
    }

    public List<CommentDto> getArticleComments(Long articleId) {
        List<Comment> comments = commentRepository
                .findByArticleIdAndParentIdIsNullAndStatusOrderByCreatedAtAsc(
                        articleId,
                        Comment.CommentStatus.APPROVED
                );

        return comments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentDto approveComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        comment.setStatus(Comment.CommentStatus.APPROVED);
        comment = commentRepository.save(comment);

        return convertToDto(comment);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        commentRepository.delete(comment);
    }

    public List<CommentDto> getReplies(Long parentId) {
        List<Comment> replies = commentRepository.findByParentIdOrderByCreatedAtAsc(parentId);

        return replies.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private CommentDto convertToDto(Comment comment) {
        List<CommentDto> replies = comment.getReplies().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return new CommentDto(
                comment.getId(),
                comment.getArticleId(),
                comment.getAuthorName(),
                comment.getAuthorEmail(),
                comment.getContent(),
                comment.getParentId(),
                comment.getStatus(),
                comment.getCreatedAt(),
                replies
        );
    }
}
