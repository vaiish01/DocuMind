
package com.documind_backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.documind_backend.dto.StudySessionRequest;
import com.documind_backend.dto.StudySessionResponse;
import com.documind_backend.entity.StudySession;
import com.documind_backend.repository.DocumentRepository;
import com.documind_backend.repository.StudySessionRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/study-sessions")
@CrossOrigin(origins = "http://localhost:5173")
public class StudySessionController {

    private final StudySessionRepository studySessionRepository;
    private final DocumentRepository documentRepository;

    public StudySessionController(
            StudySessionRepository studySessionRepository,
            DocumentRepository documentRepository
    ) {
        this.studySessionRepository = studySessionRepository;
        this.documentRepository = documentRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudySessionResponse saveSession(
            @Valid @RequestBody StudySessionRequest request
    ) {
        if (!List.of("SUMMARY", "FLASHCARDS", "QUIZ", "QUIZ_ATTEMPT")
        .contains(request.activityType())) {
            throw new IllegalArgumentException("Invalid activity type.");
        }

        if (!documentRepository.existsById(request.documentId())) {
            throw new IllegalArgumentException("Document not found.");
        }

        StudySession session = new StudySession(
                request.documentId(),
                request.activityType(),
                request.content()
        );

        return toResponse(studySessionRepository.save(session));
    }

    @GetMapping
    public List<StudySessionResponse> getSessions() {
        return studySessionRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public StudySessionResponse getSession(@PathVariable UUID id) {
        StudySession session = studySessionRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Study session not found."));

        return toResponse(session);
    }

    private StudySessionResponse toResponse(StudySession session) {
        return new StudySessionResponse(
                session.getId(),
                session.getDocumentId(),
                session.getActivityType(),
                session.getContent(),
                session.getCreatedAt()
        );
    }
}
