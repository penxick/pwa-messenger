package com.penx.messenger.controller;

// Контроллер пользователя: принимает HTTP-запросы, связанные с регистрацией, поиском и обновлением данных пользователя.

import com.penx.messenger.dto.LoginRequest;
import com.penx.messenger.dto.RegisterUserRequest;
import com.penx.messenger.dto.UpdatePasswordRequest;
import com.penx.messenger.dto.UpdatePublicIdRequest;
import com.penx.messenger.dto.UserResponse;
import com.penx.messenger.entity.User;
import com.penx.messenger.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Регистрирует нового пользователя.
    @PostMapping("/register")
    public UserResponse registerUser(@RequestBody RegisterUserRequest request) {
        User user = userService.registerUser(request);
        return toResponse(user);
    }

    // Выполняет вход пользователя по publicId и паролю.
    @PostMapping("/login")
    public UserResponse loginUser(@RequestBody LoginRequest request) {
        User user = userService.loginUser(request.getPublicId(), request.getPassword());
        return toResponse(user);
    }

    // Возвращает пользователя по publicId.
    @GetMapping("/public/{publicId}")
    public UserResponse getUserByPublicId(@PathVariable String publicId) {
        User user = userService.getUserByPublicId(publicId);
        return toResponse(user);
    }

    // Обновляет publicId пользователя по внутреннему id.
    @PatchMapping("/{id}/public-id")
    public UserResponse updatePublicId(@PathVariable long id, @RequestBody UpdatePublicIdRequest request) {
        User user = userService.updatePublicId(id, request.getPublicId());
        return toResponse(user);
    }

    // Обновляет пароль пользователя по внутреннему id.
    @PatchMapping("/{id}/password")
    public UserResponse updatePassword(@PathVariable long id, @RequestBody UpdatePasswordRequest request) {
        User user = userService.updatePassword(id, request.getOldPassword(), request.getNewPassword());
        return toResponse(user);
    }

    // Преобразует сущность User в безопасный ответ без пароля.
    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getPublicId(),
                user.getUsername(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }
}