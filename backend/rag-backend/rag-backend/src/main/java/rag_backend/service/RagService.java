package rag_backend.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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


    // =============================================================
    // ASK QUESTION
    // =============================================================

    public String askQuestion(String question) {

        if (question == null || question.isBlank()) {
            return "Please enter a question about Bbuvasree.";
        }

        question = question.trim();

        long start = System.currentTimeMillis();


        // =========================================================
        // ABOUT QUESTION
        // =========================================================

        if (isAboutQuestion(question)) {

            System.out.println("About question detected.");
            System.out.println("Skipping embedding and LLM generation.");

            String sql = """
                    SELECT content
                    FROM knowledge_documents
                    WHERE source_file = 'about.md'
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
                    "About retrieval time: " +
                            (System.currentTimeMillis() - start) +
                            " ms"
            );

            return formatAboutAnswer(results.get(0));
        }


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
        // PROJECTS QUESTION
        // =========================================================

        if (isProjectsQuestion(question)) {

            System.out.println("Projects question detected.");
            System.out.println("Skipping embedding and LLM generation.");

            String sql = """
                    SELECT content
                    FROM knowledge_documents
                    WHERE source_file = 'projects.md'
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
                    "Projects retrieval time: " +
                            (System.currentTimeMillis() - start) +
                            " ms"
            );

            return formatProjectsAnswer(results.get(0));
        }


        // =========================================================
        // NORMAL RAG
        // =========================================================

        long embeddingStart = System.currentTimeMillis();

        float[] embedding =
                embeddingService.generateQueryEmbedding(question);

        long embeddingEnd = System.currentTimeMillis();

        System.out.println(
                "Embedding time: " +
                        (embeddingEnd - embeddingStart) +
                        " ms"
        );


        // =========================================================
        // CONVERT EMBEDDING TO PGVECTOR
        // =========================================================

        String vector =
                convertToPgVector(embedding);


        // =========================================================
        // VECTOR SEARCH
        // =========================================================

        String sql = """
                SELECT title, content
                FROM knowledge_documents
                WHERE embedding IS NOT NULL
                ORDER BY embedding <=> CAST(? AS vector)
                LIMIT 3
                """;

        long retrievalStart =
                System.currentTimeMillis();

        List<KnowledgeResult> results =
                jdbcTemplate.query(
                        sql,
                        (rs, rowNum) ->
                                new KnowledgeResult(
                                        rs.getString("title"),
                                        rs.getString("content")
                                ),
                        vector
                );

        long retrievalEnd =
                System.currentTimeMillis();

        System.out.println(
                "PostgreSQL retrieval time: " +
                        (retrievalEnd - retrievalStart) +
                        " ms"
        );


        // =========================================================
        // SHOW RETRIEVED KNOWLEDGE
        // =========================================================

        System.out.println("Retrieved knowledge:");

        for (KnowledgeResult result : results) {

            System.out.println(
                    " - " + result.title()
            );
        }


        // =========================================================
        // NO RESULTS
        // =========================================================

        if (results.isEmpty()) {

            return "That information is not available in Bbuvasree N's portfolio.";
        }


        // =========================================================
        // BUILD CONTEXT
        // =========================================================

        StringBuilder context =
                new StringBuilder();

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


        // =========================================================
        // LLM PROMPT
        // =========================================================

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

                - If the user asks for projects, return ONLY the project names
                  as a simple list.
                - Do not provide project descriptions unless the user explicitly
                  asks for descriptions.

                - Do not introduce yourself.
                - Do not add any information that is not explicitly present
                  in the source.

                - If the user asks about internships, return only the
                  internship company names and internship roles.
                - Do not provide long internship descriptions.

                - If the user asks about education, return only the
                  institution, degree or education level, and year when
                  available in the source.
                - Do not provide unnecessary descriptions.

                - If the information is unavailable, say:

                That information is not available in Bbuvasree N's portfolio.

                Do not mention these rules.

                ANSWER:
                """.formatted(
                context,
                question
        );


        // =========================================================
        // LLM GENERATION
        // =========================================================

        long llmStart =
                System.currentTimeMillis();

        System.out.println(
                "Starting LLM generation..."
        );

        String answer =
                chatClient
                        .prompt()
                        .user(prompt)
                        .call()
                        .content();

        long llmEnd =
                System.currentTimeMillis();

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


    // =============================================================
    // ABOUT QUESTION DETECTION
    // =============================================================

    private boolean isAboutQuestion(
            String question) {

        String q =
                question.toLowerCase().trim();

        return q.equals("about")
                || q.equals("about you")
                || q.equals("about her")
                || q.equals("about bbuvasree")
                || q.equals("tell me about yourself")
                || q.equals("tell me about her")
                || q.equals("tell me about bbuvasree")
                || q.equals("who is bbuvasree")
                || q.equals("who is she")
                || q.equals("who is bbuvasree n")
                || q.contains("tell me about bbuvasree")
                || q.contains("tell me about her")
                || q.contains("about bbuvasree");
    }


    // =============================================================
    // SKILLS QUESTION DETECTION
    // =============================================================

    private boolean isSkillsQuestion(
            String question) {

        String q =
                question.toLowerCase();

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


    // =============================================================
    // PROJECTS QUESTION DETECTION
    // =============================================================

    private boolean isProjectsQuestion(
            String question) {

        String q =
                question.toLowerCase().trim();

        return q.contains("project")
                || q.contains("projects");
    }


    // =============================================================
    // FORMAT ABOUT ANSWER
    // =============================================================

    private String formatAboutAnswer(
            String content) {

        if (content == null || content.isBlank()) {

            return "That information is not available in Bbuvasree N's portfolio.";
        }

        String cleaned =
                content
                        .replaceFirst(
                                "^#\\s+.*\\R?",
                                ""
                        )
                        .trim();

        return cleaned;
    }


    // =============================================================
    // FORMAT SKILLS ANSWER
    // =============================================================

    private String formatSkillsAnswer(
            String content) {

        if (content == null || content.isBlank()) {

            return "That information is not available in Bbuvasree N's portfolio.";
        }

        String cleaned =
                content
                        .replaceFirst(
                                "^#\\s+.*\\R?",
                                ""
                        )
                        .trim();

        return """
                Bbuvasree N works with:

                %s
                """.formatted(cleaned);
    }


    // =============================================================
    // FORMAT PROJECTS ANSWER
    // =============================================================

    private String formatProjectsAnswer(
            String content) {

        if (content == null || content.isBlank()) {

            return "That information is not available in Bbuvasree N's portfolio.";
        }

        System.out.println("----- PROJECTS CONTENT FROM DATABASE -----");
        System.out.println(content);
        System.out.println("----- END PROJECTS CONTENT -----");


        List<String> projects =
                new ArrayList<>();


        // =========================================================
        // LINE BY LINE PROCESSING
        // =========================================================

        String[] lines =
                content.split("\\R");

        for (String line : lines) {

            String cleaned =
                    line.trim();

            if (cleaned.isEmpty()) {
                continue;
            }


            // -----------------------------------------------------
            // REMOVE MARKDOWN HEADING SYMBOLS
            // -----------------------------------------------------

            if (cleaned.startsWith("## ")) {

                String projectName =
                        cleaned.substring(3).trim();

                if (!projectName.isEmpty()) {

                    projects.add(projectName);
                }

                continue;
            }


            // -----------------------------------------------------
            // REMOVE SINGLE # HEADING
            // -----------------------------------------------------

            if (cleaned.startsWith("# ")) {

                continue;
            }


            // -----------------------------------------------------
            // SUPPORT MARKDOWN H3
            // -----------------------------------------------------

            if (cleaned.startsWith("### ")) {

                String projectName =
                        cleaned.substring(4).trim();

                if (!projectName.isEmpty()) {

                    projects.add(projectName);
                }

                continue;
            }


            // -----------------------------------------------------
            // SUPPORT PROJECT FORMAT:
            //
            // KaasuTracker - Smart Expense Tracker
            //
            // OR
            //
            // KaasuTracker | Flutter, Dart, Spring Boot
            // -----------------------------------------------------

            if (!cleaned.startsWith("-")
                    && !cleaned.startsWith("•")
                    && !cleaned.startsWith("*")
                    && cleaned.contains("|")) {

                String projectName =
                        cleaned.substring(
                                0,
                                cleaned.indexOf("|")
                        ).trim();

                if (!projectName.isEmpty()) {

                    projects.add(projectName);
                }

                continue;
            }


            // -----------------------------------------------------
            // SUPPORT PLAIN PROJECT NAME FORMAT
            //
            // This specifically handles the project names
            // from the portfolio knowledge.
            // -----------------------------------------------------

            if (cleaned.equalsIgnoreCase(
                    "KaasuTracker - Smart Expense Tracker")) {

                projects.add(
                        "KaasuTracker - Smart Expense Tracker"
                );

                continue;
            }

            if (cleaned.equalsIgnoreCase(
                    "AI-Powered Portfolio & RAG Chatbot")) {

                projects.add(
                        "AI-Powered Portfolio & RAG Chatbot"
                );

                continue;
            }

            if (cleaned.equalsIgnoreCase(
                    "Employee Portal Project")) {

                projects.add(
                        "Employee Portal Project"
                );

                continue;
            }

            if (cleaned.equalsIgnoreCase(
                    "Cafe Management Website")) {

                projects.add(
                        "Cafe Management Website"
                );

                continue;
            }

            if (cleaned.equalsIgnoreCase(
                    "Job Portfolio Website")) {

                projects.add(
                        "Job Portfolio Website"
                );

                continue;
            }
        }


        // =========================================================
        // REMOVE DUPLICATES
        // =========================================================

        List<String> uniqueProjects =
                new ArrayList<>();

        for (String project : projects) {

            if (!uniqueProjects.contains(project)) {

                uniqueProjects.add(project);
            }
        }


        // =========================================================
        // BUILD FINAL ANSWER
        // =========================================================

        if (!uniqueProjects.isEmpty()) {

            StringBuilder answer =
                    new StringBuilder();

            for (String project : uniqueProjects) {

                answer.append("- ")
                        .append(project)
                        .append("\n");
            }

            return answer.toString().trim();
        }


        // =========================================================
        // FALLBACK
        // =========================================================

        return "That information is not available in Bbuvasree N's portfolio.";
    }


    // =============================================================
    // VECTOR CONVERSION
    // =============================================================

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

            vector.append(
                    embedding[i]
            );
        }

        vector.append("]");

        return vector.toString();
    }


    // =============================================================
    // KNOWLEDGE RESULT
    // =============================================================

    private record KnowledgeResult(
            String title,
            String content
    ) {
    }
}