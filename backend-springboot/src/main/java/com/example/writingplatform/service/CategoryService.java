package com.example.writingplatform.service;

import com.example.writingplatform.dto.CategoryDto;
import com.example.writingplatform.entity.Category;
import com.example.writingplatform.exception.ResourceNotFoundException;
import com.example.writingplatform.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryDto getById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return convertToDto(category);
    }

    public List<CategoryDto> getAll() {
        return categoryRepository.findRootCategoriesWithChildren().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<CategoryDto> getTree() {
        return categoryRepository.findRootCategoriesWithChildren().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CategoryDto create(String name, Long parentId) {
        Category category = new Category();
        category.setName(name);
        category.setParentId(parentId);

        category = categoryRepository.save(category);

        return convertToDto(category);
    }

    private CategoryDto convertToDto(Category category) {
        return new CategoryDto(
                category.getId(),
                category.getName(),
                category.getParentId(),
                category.getParent() != null ? category.getParent().getName() : null,
                category.getChildren().stream()
                        .map(this::convertToDto)
                        .collect(Collectors.toList()),
                category.getArticles() != null ? category.getArticles().size() : 0,
                category.getCreatedAt()
        );
    }
}
