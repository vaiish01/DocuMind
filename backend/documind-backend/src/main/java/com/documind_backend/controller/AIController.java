
package com.documind_backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.documind_backend.dto.ChatResultResponse;
import com.documind_backend.dto.ChatRequest;
import com.documind_backend.dto.ChatResponse;
import com.documind_backend.dto.FlashcardRequest;
import com.documind_backend.dto.FlashcardsResponse;
import com.documind_backend.dto.QuizRequest;
import com.documind_backend.dto.QuizResponse;
import com.documind_backend.dto.SummaryRequest;
import com.documind_backend.service.AIService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    // AI Chat API
   @PostMapping("/chat")
public ChatResultResponse chat(@Valid @RequestBody ChatRequest request) {
    return aiService.chat(request);
}

    // AI Summary API
    @PostMapping("/summary")
    public ChatResponse generateSummary(
            @Valid @RequestBody SummaryRequest request
    ) {
        return aiService.generateSummary(request.documentId());
    }

    // AI Flashcards API
    @PostMapping("/flashcards")
    public FlashcardsResponse generateFlashcards(
            @Valid @RequestBody FlashcardRequest request
    ) {
        return aiService.generateFlashcards(request.documentId());
    }

    // AI Quiz API
    @PostMapping("/quiz")
    public QuizResponse generateQuiz(
            @Valid @RequestBody QuizRequest request
    ) {
        return aiService.generateQuiz(request.documentId());
    }
}
