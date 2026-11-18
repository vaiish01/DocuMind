
package com.documind_backend.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ai_conversations")
public class AIConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID documentId;

    @Column(nullable = false, unique = true)
    private UUID conversationId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public AIConversation() {}

    public AIConversation(UUID conversationId, UUID documentId) {
        this.conversationId = conversationId;
        this.documentId = documentId;
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public UUID getConversationId() {
        return conversationId;
    }

    public UUID getDocumentId() {
        return documentId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
