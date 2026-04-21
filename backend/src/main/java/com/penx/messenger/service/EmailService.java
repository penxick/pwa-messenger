package com.penx.messenger.service;

// Временный сервис отправки писем.
// Пока Postbox не настроен до конца, просто выводит код в консоль.

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendVerificationCode(String toEmail, String code) {
        System.out.println("=== EMAIL VERIFICATION CODE ===");
        System.out.println("To: " + toEmail);
        System.out.println("Code: " + code);
        System.out.println("===============================");
    }
}