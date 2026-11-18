
package com.documind_backend.service;

import org.springframework.stereotype.Service;

import com.documind_backend.dto.DashboardStatsResponse;
import com.documind_backend.repository.AIConversationRepository;
import com.documind_backend.repository.DocumentRepository;
import com.documind_backend.repository.StudySessionRepository;

@Service
public class DashboardService {

    private final DocumentRepository documentRepository;
    private final AIConversationRepository conversationRepository;
    private final StudySessionRepository studySessionRepository;

    public DashboardService(
            DocumentRepository documentRepository,
            AIConversationRepository conversationRepository,
            StudySessionRepository studySessionRepository) {

        this.documentRepository = documentRepository;
        this.conversationRepository = conversationRepository;
        this.studySessionRepository = studySessionRepository;
    }

    public DashboardStatsResponse getStats() {

        return new DashboardStatsResponse(
                documentRepository.count(),
                conversationRepository.count(),
                studySessionRepository.count()
        );
    }
}
