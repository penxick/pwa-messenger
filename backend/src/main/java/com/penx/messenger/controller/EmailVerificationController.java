package com.penx.messenger.controller;

// Контроллер подтверждения почты.

import com.penx.messenger.dto.VerifyEmailRequest;
import com.penx.messenger.service.EmailVerificationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

    public EmailVerificationController(EmailVerificationService emailVerificationService) {
        this.emailVerificationService = emailVerificationService;
    }

    // Отправляет код подтверждения на почту пользователя.
    @PostMapping("/send-code/{userId}")
    public String sendCode(@PathVariable Long userId) {
        emailVerificationService.sendCodeToUser(userId);
        return "Код подтверждения отправлен";
    }

    // Проверяет код подтверждения почты.
    @PostMapping("/verify")
    public String verifyEmail(@RequestBody VerifyEmailRequest request) {
        emailVerificationService.verifyCode(request.getUserId(), request.getCode());
        return "Почта успешно подтверждена";
    }
}