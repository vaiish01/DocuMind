package com.documind_backend.dto;

import java.util.UUID;

public record ChatResultResponse(
        UUID conversationId,
        String answer
) {}