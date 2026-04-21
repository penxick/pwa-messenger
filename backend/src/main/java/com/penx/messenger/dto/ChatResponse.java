package com.penx.messenger.dto;

// DTO ответа с данными чата.
import com.penx.messenger.enums.ChatType;

import java.time.LocalDateTime;
import java.util.List;

public class ChatResponse {

    private Long id;
    private ChatType type;
    private LocalDateTime createdAt;
    private List<UserResponse> members;

    public ChatResponse() {
    }

    public ChatResponse(Long id, ChatType type, LocalDateTime createdAt, List<UserResponse> members) {
        this.id = id;
        this.type = type;
        this.createdAt = createdAt;
        this.members = members;
    }

    public Long getId() {
        return id;
    }

    public ChatType getType() {
        return type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<UserResponse> getMembers() {
        return members;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setType(ChatType type) {
        this.type = type;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setMembers(List<UserResponse> members) {
        this.members = members;
    }
}