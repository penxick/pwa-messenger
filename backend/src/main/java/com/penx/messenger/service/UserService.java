package com.penx.messenger.service;

// Сервис пользователя: содержит бизнес-логику регистрации, логина, поиска и обновления данных пользователя.

import com.penx.messenger.dto.RegisterUserRequest;
import com.penx.messenger.entity.User;
import com.penx.messenger.exception.BadRequestException;
import com.penx.messenger.exception.PublicIdAlreadyExistsException;
import com.penx.messenger.exception.UserNotFoundException;
import com.penx.messenger.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Random;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;
    private final Random random = new Random();

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       EmailVerificationService emailVerificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationService = emailVerificationService;
    }

    // Регистрирует нового пользователя и сразу генерирует код подтверждения почты.
    public User registerUser(RegisterUserRequest request) {
        validateRequest(request);

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Пользователь с такой почтой уже существует");
        }

        String finalPublicId;

        if (request.getPublicId() == null || request.getPublicId().isBlank()) {
            finalPublicId = generateUniquePublicId(request.getUsername());
        } else {
            finalPublicId = normalizePublicId(request.getPublicId());

            if (userRepository.existsByPublicId(finalPublicId)) {
                throw new PublicIdAlreadyExistsException("Такой publicId уже занят");
            }
        }

        User user = new User();
        user.setPublicId(finalPublicId);
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim().toLowerCase(Locale.ROOT));
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmailVerified(false);

        user = userRepository.save(user);

        emailVerificationService.sendCodeToUser(user.getId());

        return user;
    }

    // Выполняет вход пользователя по publicId и паролю.
    public User loginUser(String publicId, String password) {
        if (publicId == null || publicId.isBlank()) {
            throw new BadRequestException("PublicId обязателен");
        }

        if (password == null || password.isBlank()) {
            throw new BadRequestException("Пароль обязателен");
        }

        String normalizedPublicId = normalizePublicId(publicId);

        User user = userRepository.findByPublicId(normalizedPublicId)
                .orElseThrow(() -> new UserNotFoundException("Пользователь с таким publicId не найден"));

        if (!user.isEmailVerified()) {
            throw new BadRequestException("Сначала подтвердите почту");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException("Неверный пароль");
        }

        return user;
    }

    // Ищет пользователя по публичному ID.
    public User getUserByPublicId(String publicId) {
        String normalizedPublicId = normalizePublicId(publicId);

        return userRepository.findByPublicId(normalizedPublicId)
                .orElseThrow(() -> new UserNotFoundException("Пользователь с таким publicId не найден"));
    }

    // Обновляет publicId пользователя по его внутреннему id.
    public User updatePublicId(long userId, String newPublicId) {
        if (newPublicId == null || newPublicId.isBlank()) {
            throw new BadRequestException("Новый publicId не может быть пустым");
        }

        String normalizedPublicId = normalizePublicId(newPublicId);

        if (normalizedPublicId.isBlank()) {
            throw new BadRequestException("publicId содержит недопустимые символы");
        }

        if (userRepository.existsByPublicId(normalizedPublicId)) {
            throw new PublicIdAlreadyExistsException("Такой publicId уже занят");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Пользователь не найден"));

        user.setPublicId(normalizedPublicId);

        return userRepository.save(user);
    }

    // Обновляет пароль пользователя по внутреннему id.
    public User updatePassword(long userId, String oldPassword, String newPassword) {
        if (oldPassword == null || oldPassword.isBlank()) {
            throw new BadRequestException("Старый пароль обязателен");
        }

        if (newPassword == null || newPassword.isBlank()) {
            throw new BadRequestException("Новый пароль обязателен");
        }

        if (newPassword.length() < 6) {
            throw new BadRequestException("Новый пароль должен быть не короче 6 символов");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Пользователь не найден"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadRequestException("Старый пароль введён неверно");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        return userRepository.save(user);
    }

    // Проверяет корректность входных данных регистрации.
    private void validateRequest(RegisterUserRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new BadRequestException("Имя пользователя обязательно");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BadRequestException("Email обязателен");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Пароль обязателен");
        }

        if (request.getPassword().length() < 6) {
            throw new BadRequestException("Пароль должен быть не короче 6 символов");
        }
    }

    // Генерирует уникальный publicId, если пользователь не ввёл его сам.
    private String generateUniquePublicId(String username) {
        String base = normalizePublicId(username);

        if (base.isBlank()) {
            base = "user";
        }

        String candidate = base;

        while (userRepository.existsByPublicId(candidate)) {
            candidate = base + random.nextInt(10000);
        }

        return candidate;
    }

    // Приводит publicId к нормальному виду: маленькие буквы и допустимые символы.
    private String normalizePublicId(String value) {
        return value.trim()
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9_]", "");
    }
        // Возвращает пользователя по внутреннему id.
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Пользователь не найден"));
    }

    // Обновляет профиль пользователя.
    public User updateProfile(Long userId, String username, String publicId, String bio, java.time.LocalDate birthDate, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Пользователь не найден"));

        if (username == null || username.isBlank()) {
            throw new BadRequestException("Имя пользователя обязательно");
        }

        if (publicId == null || publicId.isBlank()) {
            throw new BadRequestException("PublicId обязателен");
        }

        String normalizedPublicId = normalizePublicId(publicId);

        User existingUser = userRepository.findByPublicId(normalizedPublicId).orElse(null);
        if (existingUser != null && !existingUser.getId().equals(userId)) {
            throw new PublicIdAlreadyExistsException("Такой publicId уже занят");
        }

        user.setUsername(username.trim());
        user.setPublicId(normalizedPublicId);
        user.setBio(bio != null ? bio.trim() : null);
        user.setBirthDate(birthDate);
        user.setAvatarUrl(avatarUrl);

        return userRepository.save(user);
    }
}