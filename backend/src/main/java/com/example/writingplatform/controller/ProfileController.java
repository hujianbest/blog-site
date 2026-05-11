package com.example.writingplatform.controller;

import com.example.writingplatform.dto.ApiResponse;
import com.example.writingplatform.dto.UserDto;
import com.example.writingplatform.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/profile")
@RequiredArgsConstructor
@Tag(name = "Profile", description = "User profile APIs")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    @Operation(summary = "Get user profile")
    public ApiResponse<UserDto> getProfile() {
        // For demo, return fixed user ID 1
        UserDto response = profileService.getProfile(1L);
        return ApiResponse.success(response);
    }

    @PutMapping
    @Operation(summary = "Update user profile")
    public ApiResponse<UserDto> updateProfile(
            @RequestParam String name,
            @RequestParam String bio,
            @RequestParam(required = false) String avatarUrl) {
        UserDto response = profileService.updateProfile(1L, name, bio, avatarUrl);
        return ApiResponse.success(response);
    }
}
