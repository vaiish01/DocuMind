
package com.documind_backend.dto;

import java.util.List;

public record FlashcardsResponse(
        List<FlashcardItem> flashcards
) {
}
