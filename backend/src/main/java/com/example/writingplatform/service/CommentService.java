package com.example.writingplatform.service;

import com.example.writingplatform.dto.CommentDto;
import com.example.writingplatform.dto.CreateCommentRequest;
import com.example.writingplatform.entity.Comment;
import com.example.writingplatform.exception.ResourceNotFoundException;
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

    public List<CommentDto> getCommentsByArticleId(Long articleId) {
        return commentRepository.findByArticleIdAndParentIdIsNullOrderByCreatedAtAsc(articleId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<CommentDto> getReplies(Long commentId) {
        return commentRepository.findByParentIdOrderByCreatedAtAsc(commentId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CommentDto approve(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        comment.setStatus(Comment.CommentStatus.APPROVED);
        comment = commentRepository.save(comment);
        return convertToDto(comment);
    }

    public CommentDto create(CreateCommentRequest request) {
        Comment comment = new Comment();
        comment.setArticleId(request.getArticleId());
        comment.setAuthorName(request.getAuthorName());
        comment.setAuthorEmail(request.getAuthorEmail());
        comment.setContent(request.getContent());
        comment.setParentId(request.getParentId());
        comment.setStatus(Comment.CommentStatus.PENDING);

        comment = commentRepository.save(comment);
        return convertToDto(comment);
    }

    @Transactional
    public void delete(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        commentRepository.delete(comment);
    }

    private CommentDto convertToDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setArticleId(comment.getArticleId());
        dto.setAuthorName(comment.getAuthorName());
        dto.setAuthorEmail(comment.getAuthorEmail());
        dto.setContent(comment.getContent());
        dto.setParentId(comment.getParentId());
        dto.setStatus(comment.getStatus().name());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
}
