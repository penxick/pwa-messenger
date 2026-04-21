package com.penx.messenger.exception;

// Исключение для некорректных входных данных.
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}