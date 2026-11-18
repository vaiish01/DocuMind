
package com.documind_backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.documind_backend.entity.StudySession;

public interface StudySessionRepository
        extends JpaRepository<StudySession, UUID> {

    List<StudySession> findAllByOrderByCreatedAtDesc();
}
