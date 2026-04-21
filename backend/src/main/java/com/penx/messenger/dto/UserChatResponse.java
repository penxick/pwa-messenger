package com.penx.messenger.dto;

// DTO ответа со списком чатов пользователя.
import com.penx.messenger.enums.ChatType;

import java.time.LocalDateTime;

public class UserChatResponse {

    private Long chatId;
    private ChatType type;
    private LocalDateTime createdAt;
    private UserResponse otherUser;

    public UserChatResponse() {
    }

    public UserChatResponse(Long chatId, ChatType type, LocalDateTime createdAt, UserResponse otherUser) {
        this.chatId = chatId;
        this.type = type;
        this.createdAt = createdAt;
        this.otherUser = otherUser;
    }

    public Long getChatId() {
        return chatId;
    }

    public ChatType getType() {
        return type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public UserResponse getOtherUser() {
        return otherUser;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public void setType(ChatType type) {
        this.type = type;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setOtherUser(UserResponse otherUser) {
        this.otherUser = otherUser;
    }
}