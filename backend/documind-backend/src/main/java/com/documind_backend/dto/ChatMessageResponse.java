
package com.documind_backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ChatMessageResponse(
        UUID id,
        String role,
        String content,
        LocalDateTime createdAt
) {}
