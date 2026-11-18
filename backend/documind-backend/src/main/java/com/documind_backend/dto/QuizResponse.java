
package com.documind_backend.dto;

import java.util.List;

public record QuizResponse(
        List<QuizQuestion> questions
) {}
