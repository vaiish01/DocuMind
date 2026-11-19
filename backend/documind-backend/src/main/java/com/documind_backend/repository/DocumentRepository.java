
package com.documind_backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.documind_backend.entity.DocumentEntity;

public interface DocumentRepository
        extends JpaRepository<DocumentEntity, UUID> {
}
