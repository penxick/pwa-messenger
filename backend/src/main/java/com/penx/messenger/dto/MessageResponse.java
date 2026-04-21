package com.penx.messenger.dto;

// DTO ответа с данными сообщения.
import com.penx.messenger.enums.MessageType;

import java.time.LocalDateTime;

public class MessageResponse {

    private Long id;
    private Long chatId;
    private UserResponse sender;
    private MessageType type;
    private String text;
    private LocalDateTime createdAt;

    public MessageResponse() {
    }

    public MessageResponse(Long id, Long chatId, UserResponse sender, MessageType type, String text, LocalDateTime createdAt) {
        this.id = id;
        this.chatId = chatId;
        this.sender = sender;
        this.type = type;
        this.text = text;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getChatId() {
        return chatId;
    }

    public UserResponse getSender() {
        return sender;
    }

    public MessageType getType() {
        return type;
    }

    public String getText() {
        return text;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public void setSender(UserResponse sender) {
        this.sender = sender;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}