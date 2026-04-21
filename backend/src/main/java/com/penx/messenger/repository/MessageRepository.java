package com.penx.messenger.repository;

// Репозиторий сообщений: отвечает за работу с таблицей messages.

import com.penx.messenger.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatIdOrderByCreatedAtAsc(long chatId);
}