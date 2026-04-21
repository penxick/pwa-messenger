package com.penx.messenger.controller;

// Контроллер чатов: открывает личный чат, отправляет сообщения и возвращает список чатов/сообщений.

import com.penx.messenger.dto.ChatResponse;
import com.penx.messenger.dto.MessageResponse;
import com.penx.messenger.dto.OpenPrivateChatRequest;
import com.penx.messenger.dto.SendMessageRequest;
import com.penx.messenger.dto.UserChatResponse;
import com.penx.messenger.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // Открывает личный чат по currentUserId и targetUserPublicId.
    @PostMapping("/private/open")
    public ChatResponse openPrivateChat(@RequestBody OpenPrivateChatRequest request) {
        return chatService.openPrivateChat(request);
    }

    // Отправляет текстовое сообщение в чат.
    @PostMapping("/messages")
    public MessageResponse sendMessage(@RequestBody SendMessageRequest request) {
        return chatService.sendMessage(request);
    }

    // Возвращает историю сообщений чата.
    @GetMapping("/{chatId}/messages")
    public List<MessageResponse> getChatMessages(@PathVariable long chatId) {
        return chatService.getChatMessages(chatId);
    }

    // Возвращает список всех чатов пользователя.
    @GetMapping("/user/{userId}")
    public List<UserChatResponse> getUserChats(@PathVariable long userId) {
        return chatService.getUserChats(userId);
    }
}