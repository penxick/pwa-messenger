package com.penx.messenger.repository;

// Репозиторий вложений: отвечает за работу с таблицей attachments.

import com.penx.messenger.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByMessageId(long messageId);
}