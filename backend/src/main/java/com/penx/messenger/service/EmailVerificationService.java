package com.penx.messenger.service;

// Сервис генерации и проверки кодов подтверждения почты.

import com.penx.messenger.entity.EmailVerificationCode;
import com.penx.messenger.entity.User;
import com.penx.messenger.exception.BadRequestException;
import com.penx.messenger.exception.UserNotFoundException;
import com.penx.messenger.repository.EmailVerificationCodeRepository;
import com.penx.messenger.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class EmailVerificationService {

    private final EmailVerificationCodeRepository codeRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final Random random = new Random();

    public EmailVerificationService(EmailVerificationCodeRepository codeRepository,
                                    UserRepository userRepository,
                                    EmailService emailService) {
        this.codeRepository = codeRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public void sendCodeToUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Пользователь не найден"));

        if (user.isEmailVerified()) {
            throw new BadRequestException("Почта уже подтверждена");
        }

        List<EmailVerificationCode> activeCodes = codeRepository.findByUserIdAndUsedFalse(userId);
        for (EmailVerificationCode activeCode : activeCodes) {
            activeCode.setUsed(true);
        }
        codeRepository.saveAll(activeCodes);

        String code = generateFiveDigitCode();

        EmailVerificationCode verificationCode = new EmailVerificationCode();
        verificationCode.setUser(user);
        verificationCode.setCode(code);
        verificationCode.setExpiresAt(LocalDateTime.now().plusMinutes(1));
        verificationCode.setUsed(false);

        codeRepository.save(verificationCode);

        emailService.sendVerificationCode(user.getEmail(), code);
    }

    public void verifyCode(Long userId, String code) {
        if (userId == null) {
            throw new BadRequestException("userId обязателен");
        }

        if (code == null || code.isBlank()) {
            throw new BadRequestException("Код обязателен");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Пользователь не найден"));

        EmailVerificationCode verificationCode = codeRepository
                .findTopByUserIdAndCodeAndUsedFalseOrderByCreatedAtDesc(userId, code.trim())
                .orElseThrow(() -> new BadRequestException("Неверный код подтверждения"));

        if (verificationCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Срок действия кода истёк");
        }

        verificationCode.setUsed(true);
        codeRepository.save(verificationCode);

        user.setEmailVerified(true);
        userRepository.save(user);
    }

    private String generateFiveDigitCode() {
        int number = 10000 + random.nextInt(90000);
        return String.valueOf(number);
    }
}