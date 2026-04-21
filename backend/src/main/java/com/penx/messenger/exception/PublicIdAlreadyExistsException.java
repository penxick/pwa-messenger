package com.penx.messenger.exception;

// Исключение для ситуации, когда publicId уже занят.
public class PublicIdAlreadyExistsException extends RuntimeException {
    public PublicIdAlreadyExistsException(String message) {
        super(message);
    }
}