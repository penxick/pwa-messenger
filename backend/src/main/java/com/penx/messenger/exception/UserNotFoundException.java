package com.penx.messenger.exception;

// Исключение для ситуации, когда пользователь не найден.
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}