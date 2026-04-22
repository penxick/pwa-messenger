package com.penx.messenger.dto;

import java.time.LocalDateTime;

public class UserResponse {

    private Long id;
    private String publicId;
    private String username;
    private String email;
    private LocalDateTime createdAt;
    private String avatarUrl;

    public UserResponse() {
    }

    public UserResponse(Long id, String publicId, String username, String email, LocalDateTime createdAt, String avatarUrl) {
        this.id = id;
        this.publicId = publicId;
        this.username = username;
        this.email = email;
        this.createdAt = createdAt;
        this.avatarUrl = avatarUrl;
    }

    public Long getId() {
        return id;
    }

    public String getPublicId() {
        return publicId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}