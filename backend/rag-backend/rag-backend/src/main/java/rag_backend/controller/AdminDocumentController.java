package rag_backend.controller;

import rag_backend.service.DocumentIngestionService;
import rag_backend.service.DocumentIngestionService.DocumentInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/documents")
@CrossOrigin(origins = {"https://vermillion-malasada-bb6c41.netlify.app", "http://localhost:5173", "http://localhost:3000"})
public class AdminDocumentController {

    private final DocumentIngestionService ingestionService;

    public AdminDocumentController(
            DocumentIngestionService ingestionService) {

        this.ingestionService = ingestionService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file) {

        try {

            String result =
                    ingestionService.ingest(file);

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message", result
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    @GetMapping
    public ResponseEntity<List<DocumentInfo>>
    listDocuments() {

        return ResponseEntity.ok(
                ingestionService.listDocuments()
        );
    }

    @DeleteMapping("/{sourceFile}")
    public ResponseEntity<?> deleteDocument(
            @PathVariable String sourceFile) {

        ingestionService.deleteDocument(sourceFile);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message",
                        "Document deleted successfully."
                )
        );
    }
}