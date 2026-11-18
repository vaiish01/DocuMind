
package com.documind_backend.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record FlashcardRequest(
        @NotNull UUID documentId
) {
}
