package com.documind_backend.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record SummaryRequest(
        @NotNull UUID documentId
) {
}