package com.example.writingplatform.controller;

import com.example.writingplatform.dto.ApiResponse;
import com.example.writingplatform.dto.TagDto;
import com.example.writingplatform.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/tags")
@RequiredArgsConstructor
@Tag(name = "Tags", description = "Tag management APIs")
public class TagController {

    private final TagService tagService;

    @GetMapping
    @Operation(summary = "Get all tags")
    public ApiResponse<List<TagDto>> getAll() {
        List<TagDto> response = tagService.getAll();
        return ApiResponse.success(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get tag by ID")
    public ApiResponse<TagDto> getById(@PathVariable Long id) {
        TagDto response = tagService.getById(id);
        return ApiResponse.success(response);
    }

    @PostMapping
    @Operation(summary = "Create a new tag")
    public ApiResponse<TagDto> create(@RequestParam String name) {
        TagDto response = tagService.create(name);
        return ApiResponse.success(response);
    }
}
