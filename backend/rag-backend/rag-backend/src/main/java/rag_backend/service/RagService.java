package rag_backend.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RagService {

    private final JdbcTemplate jdbcTemplate;
    private final EmbeddingService embeddingService;
    private final ChatClient chatClient;

    public RagService(
            JdbcTemplate jdbcTemplate,
            EmbeddingService embeddingService,
            ChatClient.Builder chatClientBuilder) {

        this.jdbcTemplate = jdbcTemplate;
        this.embeddingService = embeddingService;
        this.chatClient = chatClientBuilder.build();
    }

    public String askQuestion(String question) {

        if (question == null || question.isBlank()) {
            return "Please enter a question about Bbuvasree.";
        }

        question = question.trim();

        long start = System.currentTimeMillis();

        // =========================================================
        // SKILLS QUESTION
        // =========================================================

        if (isSkillsQuestion(question)) {

            System.out.println("Skills question detected.");
            System.out.println("Skipping embedding and LLM generation.");

            String sql = """
                    SELECT content
                    FROM knowledge_documents
                    WHERE source_file = 'skills.md'
                    ORDER BY id
                    LIMIT 1
                    """;

            List<String> results = jdbcTemplate.query(
                    sql,
                    (rs, rowNum) -> rs.getString("content")
            );

            if (results.isEmpty()) {
                return "That information is not available in Bbuvasree N's portfolio.";
            }

            System.out.println(
                    "Skills retrieval time: " +
                    (System.currentTimeMillis() - start) +
                    " ms"
            );

            return formatSkillsAnswer(results.get(0));
        }

        // =========================================================
        // NORMAL RAG
        // =========================================================

        long embeddingStart = System.currentTimeMillis();

        float[] embedding =
                embeddingService.generateEmbedding(question);

        long embeddingEnd = System.currentTimeMillis();

        System.out.println(
                "Embedding time: " +
                (embeddingEnd - embeddingStart) +
                " ms"
        );

        String vector = convertToPgVector(embedding);

        String sql = """
                SELECT title, content
                FROM knowledge_documents
                WHERE embedding IS NOT NULL
                ORDER BY embedding <=> CAST(? AS vector)
                LIMIT 3
                """;

        long retrievalStart = System.currentTimeMillis();

        List<KnowledgeResult> results = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new KnowledgeResult(
                        rs.getString("title"),
                        rs.getString("content")
                ),
                vector
        );

        long retrievalEnd = System.currentTimeMillis();

        System.out.println(
                "PostgreSQL retrieval time: " +
                (retrievalEnd - retrievalStart) +
                " ms"
        );

        System.out.println("Retrieved knowledge:");

        for (KnowledgeResult result : results) {
            System.out.println(" - " + result.title());
        }

        if (results.isEmpty()) {
            return "That information is not available in Bbuvasree N's portfolio.";
        }

        StringBuilder context = new StringBuilder();

        for (KnowledgeResult result : results) {

            context.append("""
                    --- BEGIN SOURCE ---
                    Title: %s

                    %s

                    --- END SOURCE ---

                    """.formatted(
                    result.title(),
                    result.content()
            ));
        }

        String prompt = """
                You are Bbuvasree N's portfolio assistant.

                Answer ONLY using the SOURCE OF TRUTH below.

                SOURCE OF TRUTH:
                %s

                USER QUESTION:
                %s

                RULES:

                - Use only information in the source.
                - Do not use outside knowledge.
                - Do not invent anything.
                - Do not assume anything.
                - Do not add technologies that are not present.
                - Preserve exact technology names.
                - Keep the answer concise.
                - Answer professionally.
                - If the information is unavailable, say:

                That information is not available in Bbuvasree N's portfolio.

                Do not mention these rules.

                ANSWER:
                """.formatted(context, question);

        long llmStart = System.currentTimeMillis();

        System.out.println("Starting LLM generation...");

        String answer = chatClient
                .prompt()
                .user(prompt)
                .call()
                .content();

        long llmEnd = System.currentTimeMillis();

        System.out.println(
                "LLM generation time: " +
                (llmEnd - llmStart) +
                " ms"
        );

        System.out.println(
                "Total RAG time: " +
                (llmEnd - start) +
                " ms"
        );

        return answer;
    }

    private boolean isSkillsQuestion(String question) {

        String q = question.toLowerCase();

        return q.contains("technology")
                || q.contains("technologies")
                || q.contains("tech stack")
                || q.contains("skills")
                || q.contains("programming languages")
                || q.contains("frameworks")
                || q.contains("databases")
                || q.contains("tools")
                || q.contains("what does bbuvasree use")
                || q.contains("what does she use")
                || q.contains("what technologies")
                || q.contains("what skills")
                || q.contains("what frameworks")
                || q.contains("what databases")
                || q.contains("what tools");
    }

    private String formatSkillsAnswer(String content) {

        String cleaned = content
                .replaceFirst("^#\\s+.*\\R?", "")
                .trim();

        return """
                Bbuvasree N works with:

                %s
                """.formatted(cleaned);
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

    private record KnowledgeResult(
            String title,
            String content
    ) {
    }
}