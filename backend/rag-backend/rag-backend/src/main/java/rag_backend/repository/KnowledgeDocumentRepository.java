package rag_backend.repository;

import rag_backend.model.KnowledgeDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KnowledgeDocumentRepository
        extends JpaRepository<KnowledgeDocument, Long> {
}