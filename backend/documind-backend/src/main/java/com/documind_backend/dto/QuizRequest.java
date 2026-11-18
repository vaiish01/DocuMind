
package com.documind_backend.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record QuizRequest(
        @NotNull UUID documentId
) {}
