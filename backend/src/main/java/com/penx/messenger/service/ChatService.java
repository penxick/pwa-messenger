package com.penx.messenger.service;

// Сервис чатов: открывает личный чат между двумя пользователями, находит существующий или создаёт новый,
// а также отправляет текстовые сообщения в чат.

import com.penx.messenger.dto.ChatResponse;
import com.penx.messenger.dto.MessageResponse;
import com.penx.messenger.dto.OpenPrivateChatRequest;
import com.penx.messenger.dto.SendMessageRequest;
import com.penx.messenger.dto.UserResponse;
import com.penx.messenger.entity.Chat;
import com.penx.messenger.entity.ChatMember;
import com.penx.messenger.entity.Message;
import com.penx.messenger.entity.User;
import com.penx.messenger.enums.ChatMemberRole;
import com.penx.messenger.enums.ChatType;
import com.penx.messenger.enums.MessageType;
import com.penx.messenger.exception.BadRequestException;
import com.penx.messenger.exception.UserNotFoundException;
import com.penx.messenger.repository.ChatMemberRepository;
import com.penx.messenger.repository.ChatRepository;
import com.penx.messenger.repository.MessageRepository;
import com.penx.messenger.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.penx.messenger.dto.UserChatResponse;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    public ChatService(ChatRepository chatRepository,
                       ChatMemberRepository chatMemberRepository,
                       UserRepository userRepository,
                       MessageRepository messageRepository) {
        this.chatRepository = chatRepository;
        this.chatMemberRepository = chatMemberRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
    }

    // Открывает личный чат между текущим пользователем и найденным пользователем по publicId.
    public ChatResponse openPrivateChat(OpenPrivateChatRequest request) {
        if (request.getCurrentUserId() <= 0) {
            throw new BadRequestException("currentUserId обязателен");
        }

        if (request.getTargetUserPublicId() == null || request.getTargetUserPublicId().isBlank()) {
            throw new BadRequestException("targetUserPublicId обязателен");
        }

        User currentUser = userRepository.findById(request.getCurrentUserId())
                .orElseThrow(() -> new UserNotFoundException("Текущий пользователь не найден"));

        String normalizedPublicId = normalizePublicId(request.getTargetUserPublicId());

        User targetUser = userRepository.findByPublicId(normalizedPublicId)
                .orElseThrow(() -> new UserNotFoundException("Пользователь с таким publicId не найден"));

        long currentUserId = requireUserId(currentUser);
        long targetUserId = requireUserId(targetUser);

        if (currentUserId == targetUserId) {
            throw new BadRequestException("Нельзя открыть личный чат с самим собой");
        }

        Optional<Chat> existingChat = findExistingPrivateChat(currentUserId, targetUserId);

        Chat chat = existingChat.orElseGet(() -> createPrivateChat(currentUser, targetUser));

        return buildChatResponse(chat);
    }

    // Отправляет текстовое сообщение в чат.
    public MessageResponse sendMessage(SendMessageRequest request) {
        if (request.getChatId() == null) {
            throw new BadRequestException("chatId обязателен");
        }

        if (request.getSenderId() == null) {
            throw new BadRequestException("senderId обязателен");
        }

        if (request.getText() == null || request.getText().isBlank()) {
            throw new BadRequestException("Текст сообщения обязателен");
        }

        Chat chat = chatRepository.findById(request.getChatId())
                .orElseThrow(() -> new BadRequestException("Чат не найден"));

        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new UserNotFoundException("Отправитель не найден"));

        long chatId = requireChatId(chat);
        long senderId = requireUserId(sender);

        boolean isMember = chatMemberRepository.findByChatId(chatId).stream()
                .anyMatch(member -> requireUserId(member.getUser()) == senderId);

        if (!isMember) {
            throw new BadRequestException("Пользователь не состоит в этом чате");
        }

        Message message = new Message();
        message.setChat(chat);
        message.setSender(sender);
        message.setType(MessageType.TEXT);
        message.setText(request.getText().trim());

        message = messageRepository.save(message);

        return toMessageResponse(message);
    }

    // Ищет уже существующий личный чат между двумя пользователями.
    private Optional<Chat> findExistingPrivateChat(long firstUserId, long secondUserId) {
        List<ChatMember> firstUserMemberships =
                chatMemberRepository.findByUserIdAndChatType(firstUserId, ChatType.PRIVATE);

        for (ChatMember membership : firstUserMemberships) {
            long chatId = requireChatId(membership.getChat());

            List<ChatMember> chatMembers = chatMemberRepository.findByChatId(chatId);

            if (chatMembers.size() == 2) {
                Set<Long> userIds = chatMembers.stream()
                        .map(member -> requireUserId(member.getUser()))
                        .collect(Collectors.toSet());

                if (userIds.contains(firstUserId) && userIds.contains(secondUserId)) {
                    return Optional.of(membership.getChat());
                }
            }
        }

        return Optional.empty();
    }

    // Создаёт новый личный чат между двумя пользователями.
    private Chat createPrivateChat(User firstUser, User secondUser) {
        Chat chat = new Chat();
        chat.setType(ChatType.PRIVATE);
        chat = chatRepository.save(chat);

        ChatMember firstMember = new ChatMember();
        firstMember.setChat(chat);
        firstMember.setUser(firstUser);
        firstMember.setRole(ChatMemberRole.MEMBER);

        ChatMember secondMember = new ChatMember();
        secondMember.setChat(chat);
        secondMember.setUser(secondUser);
        secondMember.setRole(ChatMemberRole.MEMBER);

        chatMemberRepository.save(firstMember);
        chatMemberRepository.save(secondMember);

        return chat;
    }

    // Собирает DTO ответа по чату.
    private ChatResponse buildChatResponse(Chat chat) {
        long chatId = requireChatId(chat);

        List<ChatMember> members = chatMemberRepository.findByChatId(chatId);

        List<UserResponse> memberResponses = members.stream()
                .map(ChatMember::getUser)
                .map(this::toUserResponse)
                .toList();

        return new ChatResponse(
                chatId,
                chat.getType(),
                chat.getCreatedAt(),
                memberResponses
        );
    }

    // Преобразует сообщение в DTO ответа.
    private MessageResponse toMessageResponse(Message message) {
        long chatId = requireChatId(message.getChat());

        return new MessageResponse(
                message.getId(),
                chatId,
                toUserResponse(message.getSender()),
                message.getType(),
                message.getText(),
                message.getCreatedAt()
        );
    }

    // Преобразует пользователя в безопасный DTO без пароля.
    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                requireUserId(user),
                user.getPublicId(),
                user.getUsername(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }

    // Возвращает гарантированно непустой id пользователя.
    private long requireUserId(User user) {
        return Objects.requireNonNull(user.getId(), "User id must not be null");
    }

    // Возвращает гарантированно непустой id чата.
    private long requireChatId(Chat chat) {
        return Objects.requireNonNull(chat.getId(), "Chat id must not be null");
    }

    // Приводит publicId к нормальному виду.
    private String normalizePublicId(String value) {
        return value.trim()
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9_]", "");
    }
        // Возвращает все сообщения чата по chatId.
    public List<MessageResponse> getChatMessages(long chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new BadRequestException("Чат не найден"));

        return messageRepository.findByChatIdOrderByCreatedAtAsc(requireChatId(chat)).stream()
                .map(this::toMessageResponse)
                .collect(Collectors.toList());
    }

        // Возвращает список всех чатов пользователя.
    public List<UserChatResponse> getUserChats(long userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Пользователь не найден"));

        List<ChatMember> memberships = chatMemberRepository.findByUserId(requireUserId(currentUser));

        return memberships.stream()
                .map(ChatMember::getChat)
                .distinct()
                .map(chat -> toUserChatResponse(chat, requireUserId(currentUser)))
                .toList();
    }

        // Преобразует чат в DTO для списка чатов пользователя.
    private UserChatResponse toUserChatResponse(Chat chat, long currentUserId) {
        List<ChatMember> members = chatMemberRepository.findByChatId(requireChatId(chat));

        User otherUser = members.stream()
                .map(ChatMember::getUser)
                .filter(user -> requireUserId(user) != currentUserId)
                .findFirst()
                .orElse(null);

        UserResponse otherUserResponse = otherUser != null ? toUserResponse(otherUser) : null;

        return new UserChatResponse(
                requireChatId(chat),
                chat.getType(),
                chat.getCreatedAt(),
                otherUserResponse
        );
    }
}