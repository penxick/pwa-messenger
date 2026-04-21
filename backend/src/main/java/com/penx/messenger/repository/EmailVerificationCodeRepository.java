package com.penx.messenger.repository;

// Репозиторий кодов подтверждения почты.

import com.penx.messenger.entity.EmailVerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmailVerificationCodeRepository extends JpaRepository<EmailVerificationCode, Long> {
    Optional<EmailVerificationCode> findTopByUserIdAndCodeAndUsedFalseOrderByCreatedAtDesc(Long userId, String code);
    List<EmailVerificationCode> findByUserIdAndUsedFalse(Long userId);
}