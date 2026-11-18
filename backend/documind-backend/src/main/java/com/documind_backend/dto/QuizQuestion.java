
package com.documind_backend.dto;

import java.util.List;

public record QuizQuestion(
        String question,
        List<String> options,
        int correctOptionIndex,
        String explanation
) {}
