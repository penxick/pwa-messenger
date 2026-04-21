package com.penx.messenger.dto;

// DTO для отправки текстового сообщения в чат.
public class SendMessageRequest {

    private Long chatId;
    private Long senderId;
    private String text;

    public SendMessageRequest() {
    }

    public SendMessageRequest(Long chatId, Long senderId, String text) {
        this.chatId = chatId;
        this.senderId = senderId;
        this.text = text;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}