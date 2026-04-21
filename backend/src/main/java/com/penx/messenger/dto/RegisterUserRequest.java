//Что делает этот класс
//Он принимает данные от клиента.
//Если пользователь сам придумал publicId, он придёт сюда.
//Если не придумал — поле будет пустым, и мы сгенерируем его в сервисе.
// DTO для регистрации: принимает данные пользователя из HTTP-запроса.
package com.penx.messenger.dto;

public class RegisterUserRequest {

    private String publicId;
    private String username;
    private String email;
    private String password;

    public RegisterUserRequest() {
    }

    public RegisterUserRequest(String publicId, String username, String email, String password) {
        this.publicId = publicId;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}