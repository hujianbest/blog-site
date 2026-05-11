package com.example.writingplatform.service;

import com.example.writingplatform.dto.AuthRequest;
import com.example.writingplatform.dto.AuthResponse;
import com.example.writingplatform.dto.UserDto;
import com.example.writingplatform.entity.User;
import com.example.writingplatform.exception.ResourceAlreadyExistsException;
import com.example.writingplatform.exception.ResourceNotFoundException;
import com.example.writingplatform.repository.UserRepository;
import com.example.writingplatform.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        return new AuthResponse(token, null, "Bearer", convertToDto(user));
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResourceNotFoundException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        return new AuthResponse(token, null, "Bearer", convertToDto(user));
    }

    public UserDto getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return convertToDto(user);
    }

    private UserDto convertToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getBio(),
                user.getAvatar(),
                user.getGithub(),
                user.getTwitter(),
                user.getCreatedAt()
        );
    }
}
