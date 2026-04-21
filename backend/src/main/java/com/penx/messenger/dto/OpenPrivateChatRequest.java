package com.penx.messenger.dto;

// DTO для открытия личного чата с пользователем по его publicId.
public class OpenPrivateChatRequest {

    private long currentUserId;
    private String targetUserPublicId;

    public OpenPrivateChatRequest() {
    }

    public OpenPrivateChatRequest(long currentUserId, String targetUserPublicId) {
        this.currentUserId = currentUserId;
        this.targetUserPublicId = targetUserPublicId;
    }

    public long getCurrentUserId() {
        return currentUserId;
    }

    public void setCurrentUserId(long currentUserId) {
        this.currentUserId = currentUserId;
    }

    public String getTargetUserPublicId() {
        return targetUserPublicId;
    }

    public void setTargetUserPublicId(String targetUserPublicId) {
        this.targetUserPublicId = targetUserPublicId;
    }
}