package com.example.writingplatform.service;

import com.example.writingplatform.dto.TagDto;
import com.example.writingplatform.entity.Tag;
import com.example.writingplatform.exception.ResourceAlreadyExistsException;
import com.example.writingplatform.exception.ResourceNotFoundException;
import com.example.writingplatform.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    public List<TagDto> getAll() {
        return tagRepository.findAllWithArticleCount().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TagDto getById(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found"));
        return convertToDto(tag);
    }

    public TagDto getByName(String name) {
        Tag tag = tagRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found"));
        return convertToDto(tag);
    }

    public TagDto create(String name) {
        if (tagRepository.existsByName(name)) {
            throw new ResourceAlreadyExistsException("Tag already exists");
        }

        Tag tag = new Tag();
        tag.setName(name);

        tag = tagRepository.save(tag);

        return convertToDto(tag);
    }

    private TagDto convertToDto(Tag tag) {
        return new TagDto(
                tag.getId(),
                tag.getName(),
                tag.getCreatedAt()
        );
    }
}
