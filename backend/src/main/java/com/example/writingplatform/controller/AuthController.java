package com.example.writingplatform.controller;

import com.example.writingplatform.dto.ApiResponse;
import com.example.writingplatform.dto.AuthRequest;
import com.example.writingplatform.dto.AuthResponse;
import com.example.writingplatform.dto.UserDto;
import com.example.writingplatform.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication APIs")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.register(request);
        return ApiResponse.success(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ApiResponse.success(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user")
    public ApiResponse<UserDto> getCurrentUser(@RequestHeader("Authorization") String authorization) {
        // Extract user ID from JWT token (handled by filter)
        // For simplicity, we'll return a mock user for now
        // In production, extract userId from SecurityContext
        return ApiResponse.success(new UserDto());
    }
}
