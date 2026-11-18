
package com.documind_backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ConversationResponse(
        UUID conversationId,
        UUID documentId,
        LocalDateTime createdAt
) {}
