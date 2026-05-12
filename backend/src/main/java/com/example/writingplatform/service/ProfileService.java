package com.example.writingplatform.service;

import com.example.writingplatform.dto.UserDto;
import com.example.writingplatform.entity.User;
import com.example.writingplatform.exception.ResourceNotFoundException;
import com.example.writingplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    public UserDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return convertToDto(user);
    }

    public UserDto updateProfile(Long userId, String name, String bio, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setName(name);
        user.setBio(bio);
        if (avatarUrl != null) {
            user.setAvatar(avatarUrl);
        }

        user = userRepository.save(user);
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
