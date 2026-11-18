
package com.documind_backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.documind_backend.entity.AIConversation;

public interface AIConversationRepository
        extends JpaRepository<AIConversation, UUID> {

    boolean existsByConversationId(UUID conversationId);

    Optional<AIConversation> findByConversationId(UUID conversationId);

    List<AIConversation> findAllByOrderByCreatedAtDesc();
}
