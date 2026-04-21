// Репозиторий пользователя: отвечает за работу с таблицей users через Spring Data JPA.
package com.penx.messenger.repository;

import com.penx.messenger.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPublicId(String publicId);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    boolean existsByPublicId(String publicId);
    boolean existsByEmail(String email);
}