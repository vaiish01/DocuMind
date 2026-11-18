
package com.documind_backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record StudySessionResponse(
        UUID id,
        UUID documentId,
        String activityType,
        String content,
        LocalDateTime createdAt
) {
}
