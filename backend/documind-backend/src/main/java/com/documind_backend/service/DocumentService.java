
package com.documind_backend.service;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.documind_backend.dto.DocumentResponse;
import com.documind_backend.entity.DocumentEntity;
import com.documind_backend.repository.DocumentRepository;

@Service
public class DocumentService {

    private final DocumentRepository repository;
    private final Tika tika = new Tika();

    public DocumentService(DocumentRepository repository) {
        this.repository = repository;
    }

    public DocumentResponse uploadDocument(MultipartFile file)
            throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a file.");
        }

        String filename = file.getOriginalFilename();

        if (filename == null || filename.isBlank()) {
            throw new IllegalArgumentException("Invalid filename.");
        }

        String lowerName = filename.toLowerCase();

        if (!(lowerName.endsWith(".pdf")
                || lowerName.endsWith(".docx")
                || lowerName.endsWith(".txt"))) {
            throw new IllegalArgumentException(
                    "Only PDF, DOCX and TXT files are supported."
            );
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException(
                    "File size must be less than 10 MB."
            );
        }

       String extractedText;

try {
    extractedText = tika.parseToString(file.getInputStream());
} catch (TikaException e) {
    throw new IllegalArgumentException(
        "Unable to extract text from this document."
    );
}

        if (extractedText == null || extractedText.isBlank()) {
            throw new IllegalArgumentException(
                    "No readable text was found in this document."
            );
        }

        DocumentEntity document = new DocumentEntity();

        document.setTitle(filename);
        document.setOriginalFilename(filename);
        document.setContentType(file.getContentType());
        document.setFileSize(file.getSize());
        document.setExtractedText(extractedText);

        DocumentEntity saved = repository.save(document);

        return convertToResponse(saved);
    }

    public List<DocumentResponse> getAllDocuments() {

        return repository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public DocumentResponse getDocumentById(UUID id) {

        DocumentEntity document = repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Document not found."
                ));

        return convertToResponse(document);
    }

    public void deleteDocument(UUID id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException("Document not found.");
        }

        repository.deleteById(id);
    }
    
    private DocumentResponse convertToResponse(
            DocumentEntity document) {

        return new DocumentResponse(
                document.getId(),
                document.getTitle(),
                document.getOriginalFilename(),
                document.getContentType(),
                document.getFileSize(),
                document.getUploadedAt(),
                document.getExtractedText()
        );
    }
        
}
