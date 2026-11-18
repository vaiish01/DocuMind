
package com.documind_backend.repository;

import com.documind_backend.entity.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface DocumentRepository
        extends JpaRepository<DocumentEntity, UUID> {
}
