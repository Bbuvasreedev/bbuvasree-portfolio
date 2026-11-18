package rag_backend.config;

import rag_backend.service.EmbeddingService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class KnowledgeDataLoader implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;
    private final EmbeddingService embeddingService;

    public KnowledgeDataLoader(
            JdbcTemplate jdbcTemplate,
            EmbeddingService embeddingService) {

        this.jdbcTemplate = jdbcTemplate;
        this.embeddingService = embeddingService;
    }

    @Override
    public void run(String... args) throws Exception {

        System.out.println(
                "=== KNOWLEDGE DATA LOADER STARTED ==="
        );

        PathMatchingResourcePatternResolver resolver =
                new PathMatchingResourcePatternResolver();

        Resource[] resources =
                resolver.getResources(
                        "classpath:knowledge/*.md"
                );

        if (resources.length == 0) {

            System.out.println(
                    "No knowledge files found in classpath:knowledge"
            );

            return;
        }

        System.out.println(
                "Found " + resources.length +
                        " knowledge files."
        );

        for (Resource resource : resources) {

            processFile(resource);
        }
    }

    private void processFile(Resource resource) {

        try {

            String content =
                    new String(
                            resource.getInputStream().readAllBytes(),
                            StandardCharsets.UTF_8
                    );

            if (content.isBlank()) {
                return;
            }

            String sourceFile =
                    resource.getFilename();

            if (sourceFile == null) {
                return;
            }

            String existingContent = null;

            try {

                existingContent =
                        jdbcTemplate.queryForObject(
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

            /*
             * If the file has already been indexed
             * and its content has not changed,
             * do not create another embedding.
             */
            if (content.equals(existingContent)) {

                System.out.println(
                        "Knowledge file already loaded: "
                                + sourceFile
                );

                return;
            }

            System.out.println(
                    "Generating document embedding: "
                            + sourceFile
            );

            /*
             * IMPORTANT:
             *
             * Knowledge documents use
             * RETRIEVAL_DOCUMENT.
             */
            float[] embedding =
                    embeddingService.generateDocumentEmbedding(
                            content
                    );

            System.out.println(
                    "Document embedding completed: "
                            + sourceFile
            );

            String vector =
                    convertToPgVector(embedding);

            if (existingContent == null) {

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
                        "Loaded new knowledge file: "
                                + sourceFile
                );

            } else {

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
                        "Updated knowledge file: "
                                + sourceFile
                );
            }

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to read knowledge file: "
                            + resource,
                    e
            );
        }
    }

    private String extractTitle(String content) {

        for (String line : content.split("\\R")) {

            if (line.startsWith("# ")) {

                return line
                        .substring(2)
                        .trim();
            }
        }

        return "Portfolio Knowledge";
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
}