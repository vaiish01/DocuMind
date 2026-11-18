
package com.documind_backend.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record StudySessionRequest(
        @NotNull UUID documentId,
        @NotBlank String activityType,
        @NotBlank String content
) {
}
