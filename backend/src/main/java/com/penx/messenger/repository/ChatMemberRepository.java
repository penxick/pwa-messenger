package com.penx.messenger.repository;

// Репозиторий участников чата: отвечает за работу с таблицей chat_members.

import com.penx.messenger.entity.ChatMember;
import com.penx.messenger.enums.ChatType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMemberRepository extends JpaRepository<ChatMember, Long> {
    List<ChatMember> findByUserId(long userId);
    List<ChatMember> findByChatId(long chatId);
    List<ChatMember> findByUserIdAndChatType(long userId, ChatType type);
}