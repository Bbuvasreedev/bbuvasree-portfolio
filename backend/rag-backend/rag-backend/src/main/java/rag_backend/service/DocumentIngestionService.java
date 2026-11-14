package rag_backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class DocumentIngestionService {

    private final JdbcTemplate jdbcTemplate;
    private final EmbeddingModel embeddingModel;

    public DocumentIngestionService(
            JdbcTemplate jdbcTemplate,
            EmbeddingModel embeddingModel) {

        this.jdbcTemplate = jdbcTemplate;
        this.embeddingModel = embeddingModel;
    }

    public String ingest(MultipartFile file) throws Exception {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty.");
        }

        String originalName = file.getOriginalFilename();

        if (originalName == null || originalName.isBlank()) {
            throw new IllegalArgumentException("Invalid file name.");
        }

        String fileName = originalName
                .replace("\\", "_")
                .replace("/", "_");

        String extension = getExtension(fileName);

        if (!List.of("pdf", "docx", "txt", "md").contains(extension)) {
            throw new IllegalArgumentException(
                    "Only PDF, DOCX, TXT and MD files are supported."
            );
        }

        String text = extractText(file, extension);

        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException(
                    "No readable text found in the document."
            );
        }

        // Remove previous version of this document
        jdbcTemplate.update(
                "DELETE FROM knowledge_documents WHERE source_file = ?",
                fileName
        );

        List<String> chunks = chunkText(text, 1200, 200);

        int chunkIndex = 0;

        for (String chunk : chunks) {

            float[] embedding =
                    embeddingModel.embed(chunk);

            String vector =
                    convertToPgVector(embedding);

            String title =
                    fileName + " - Chunk " + (chunkIndex + 1);

            jdbcTemplate.update(
                    """
                    INSERT INTO knowledge_documents
                    (title, content, source_file, embedding)
                    VALUES (?, ?, ?, CAST(? AS vector))
                    """,
                    title,
                    chunk,
                    fileName,
                    vector
            );

            chunkIndex++;
        }

        return "Successfully indexed " +
                fileName +
                " (" +
                chunks.size() +
                " chunks)";
    }

    public List<DocumentInfo> listDocuments() {

        String sql = """
                SELECT source_file,
                       COUNT(*) AS chunks,
                       MIN(created_at) AS created_at
                FROM knowledge_documents
                GROUP BY source_file
                ORDER BY MIN(created_at) DESC
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new DocumentInfo(
                        rs.getString("source_file"),
                        rs.getInt("chunks"),
                        rs.getTimestamp("created_at")
                                .toLocalDateTime()
                                .toString()
                )
        );
    }

    public void deleteDocument(String sourceFile) {

        jdbcTemplate.update(
                "DELETE FROM knowledge_documents WHERE source_file = ?",
                sourceFile
        );
    }

    private String extractText(
            MultipartFile file,
            String extension) throws Exception {

        if (extension.equals("txt") || extension.equals("md")) {

            return new String(
                    file.getBytes(),
                    StandardCharsets.UTF_8
            );
        }

        if (extension.equals("pdf")) {

            try (InputStream inputStream =
                         file.getInputStream()) {

                byte[] bytes = inputStream.readAllBytes();

                try (PDDocument document =
                             Loader.loadPDF(bytes)) {

                    PDFTextStripper stripper =
                            new PDFTextStripper();

                    return stripper.getText(document);
                }
            }
        }

        if (extension.equals("docx")) {

            try (InputStream inputStream =
                         file.getInputStream();

                 XWPFDocument document =
                         new XWPFDocument(inputStream);

                 XWPFWordExtractor extractor =
                         new XWPFWordExtractor(document)) {

                return extractor.getText();
            }
        }

        throw new IllegalArgumentException(
                "Unsupported document type."
        );
    }

    private List<String> chunkText(
            String text,
            int chunkSize,
            int overlap) {

        String normalized =
                text.replace("\r\n", "\n")
                        .replace("\r", "\n")
                        .trim();

        List<String> chunks =
                new ArrayList<>();

        if (normalized.length() <= chunkSize) {
            chunks.add(normalized);
            return chunks;
        }

        int start = 0;

        while (start < normalized.length()) {

            int end =
                    Math.min(
                            start + chunkSize,
                            normalized.length()
                    );

            if (end < normalized.length()) {

                int newline =
                        normalized.lastIndexOf(
                                '\n',
                                end
                        );

                if (newline > start + 500) {
                    end = newline;
                }
            }

            String chunk =
                    normalized
                            .substring(start, end)
                            .trim();

            if (!chunk.isBlank()) {
                chunks.add(chunk);
            }

            if (end >= normalized.length()) {
                break;
            }

            start =
                    Math.max(
                            end - overlap,
                            start + 1
                    );
        }

        return chunks;
    }

    private String getExtension(String fileName) {

        int index =
                fileName.lastIndexOf('.');

        if (index == -1) {
            return "";
        }

        return fileName
                .substring(index + 1)
                .toLowerCase();
    }

    private String convertToPgVector(
            float[] embedding) {

        StringBuilder vector =
                new StringBuilder("[");

        for (int i = 0;
             i < embedding.length;
             i++) {

            if (i > 0) {
                vector.append(",");
            }

            vector.append(embedding[i]);
        }

        vector.append("]");

        return vector.toString();
    }

    public record DocumentInfo(
            String sourceFile,
            int chunks,
            String createdAt
    ) {
    }
}