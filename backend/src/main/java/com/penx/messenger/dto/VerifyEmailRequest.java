package com.penx.messenger.dto;

// DTO для подтверждения почты кодом.
public class VerifyEmailRequest {

    private Long userId;
    private String code;

    public VerifyEmailRequest() {
    }

    public VerifyEmailRequest(Long userId, String code) {
        this.userId = userId;
        this.code = code;
    }

    public Long getUserId() {
        return userId;
    }

    public String getCode() {
        return code;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setCode(String code) {
        this.code = code;
    }
}