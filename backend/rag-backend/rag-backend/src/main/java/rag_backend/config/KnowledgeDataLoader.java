package rag_backend.config;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

@Component
public class KnowledgeDataLoader implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;
    private final EmbeddingModel embeddingModel;

    public KnowledgeDataLoader(
            JdbcTemplate jdbcTemplate,
            EmbeddingModel embeddingModel) {
        this.jdbcTemplate = jdbcTemplate;
        this.embeddingModel = embeddingModel;
    }

    @Override
    public void run(String... args) throws Exception {

        Path knowledgeFolder = Paths.get(
                "C:/Muruga/Animi Portfolio/portfolio/rag-knowledge"
        );

        if (!Files.exists(knowledgeFolder)) {
            System.out.println(
                    "Knowledge folder not found: " + knowledgeFolder
            );
            return;
        }

        try (Stream<Path> files = Files.list(knowledgeFolder)) {

            files.filter(path -> path.toString().endsWith(".md"))
                    .forEach(this::processFile);
        }
    }

    private void processFile(Path file) {

        try {

            String content = Files.readString(file);

            if (content == null || content.isBlank()) {
                return;
            }

            String sourceFile = file.getFileName().toString();

            // Check whether this file already exists
            String existingContent = null;

            try {

                existingContent = jdbcTemplate.queryForObject(
                        """
                        SELECT content
                        FROM knowledge_documents
                        WHERE source_file = ?
                        ORDER BY id DESC
                        LIMIT 1
                        """,
                        String.class,
                        sourceFile
                );

            } catch (Exception ignored) {
                // File does not exist yet
            }

            // If the file has not changed, don't generate
            // another embedding.
            if (content.equals(existingContent)) {

                System.out.println(
                        "Knowledge file already loaded: " + sourceFile
                );

                return;
            }

            // Generate embedding only for new/changed content
            float[] embedding = embeddingModel.embed(content);

            String vector = convertToPgVector(embedding);

            if (existingContent == null) {

                // New knowledge file
                String insertSql = """
                        INSERT INTO knowledge_documents
                        (title, content, source_file, embedding)
                        VALUES (?, ?, ?, CAST(? AS vector))
                        """;

                jdbcTemplate.update(
                        insertSql,
                        extractTitle(content),
                        content,
                        sourceFile,
                        vector
                );

                System.out.println(
                        "Loaded new knowledge file: " + sourceFile
                );

            } else {

                // Existing file changed
                String updateSql = """
                        UPDATE knowledge_documents
                        SET title = ?,
                            content = ?,
                            embedding = CAST(? AS vector)
                        WHERE id = (
                            SELECT id
                            FROM knowledge_documents
                            WHERE source_file = ?
                            ORDER BY id DESC
                            LIMIT 1
                        )
                        """;

                jdbcTemplate.update(
                        updateSql,
                        extractTitle(content),
                        content,
                        vector,
                        sourceFile
                );

                System.out.println(
                        "Updated knowledge file: " + sourceFile
                );
            }

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to read knowledge file: " + file,
                    e
            );
        }
    }

    private String extractTitle(String content) {

        for (String line : content.split("\\R")) {

            if (line.startsWith("# ")) {
                return line.substring(2).trim();
            }
        }

        return "Portfolio Knowledge";
    }

    private String convertToPgVector(float[] embedding) {

        StringBuilder vector = new StringBuilder("[");

        for (int i = 0; i < embedding.length; i++) {

            if (i > 0) {
                vector.append(",");
            }

            vector.append(embedding[i]);
        }

        vector.append("]");

        return vector.toString();
    }
}