package com.penx.messenger.dto;

// DTO для запроса на вход в аккаунт по publicId и паролю.
public class LoginRequest {

    private String publicId;
    private String password;

    public LoginRequest() {
    }

    public LoginRequest(String publicId, String password) {
        this.publicId = publicId;
        this.password = password;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}