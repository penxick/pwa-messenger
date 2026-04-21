package com.penx.messenger.dto;

// DTO для запроса на изменение публичного ID пользователя.
public class UpdatePublicIdRequest {

    private String publicId;

    public UpdatePublicIdRequest() {
    }

    public UpdatePublicIdRequest(String publicId) {
        this.publicId = publicId;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }
}