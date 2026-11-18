
package com.documind_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ChatRequest(
        @NotNull UUID documentId,
        UUID conversationId,
        @NotBlank String question
) {}
