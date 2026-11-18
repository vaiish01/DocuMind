
package com.documind_backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record DocumentResponse(
        UUID id,
        String title,
        String originalFilename,
        String contentType,
        long fileSize,
        LocalDateTime uploadedAt,
        String extractedText
) {
}
