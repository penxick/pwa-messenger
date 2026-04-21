package com.penx.messenger.repository;

// Репозиторий чатов: отвечает за работу с таблицей chats.

import com.penx.messenger.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat, Long> {
}