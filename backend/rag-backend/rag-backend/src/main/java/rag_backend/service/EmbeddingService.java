package rag_backend.service;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingRequest;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.ai.google.genai.text.GoogleGenAiTextEmbeddingOptions;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmbeddingService {

    private final EmbeddingModel embeddingModel;

    public EmbeddingService(EmbeddingModel embeddingModel) {
        this.embeddingModel = embeddingModel;
    }

    /*
     * =========================================================
     * DOCUMENT EMBEDDING
     * =========================================================
     *
     * Used when storing portfolio knowledge files.
     *
     * Documents use RETRIEVAL_DOCUMENT.
     */
    public float[] generateDocumentEmbedding(String text) {

        GoogleGenAiTextEmbeddingOptions options =
                GoogleGenAiTextEmbeddingOptions.builder()
                        .model("gemini-embedding-001")
                        .taskType(
                                GoogleGenAiTextEmbeddingOptions.TaskType.RETRIEVAL_DOCUMENT
                        )
                        .dimensions(768)
                        .build();

        EmbeddingRequest request =
                new EmbeddingRequest(
                        List.of(text),
                        options
                );

        EmbeddingResponse response =
                embeddingModel.call(request);

        return response
                .getResults()
                .get(0)
                .getOutput();
    }


    /*
     * =========================================================
     * QUERY EMBEDDING
     * =========================================================
     *
     * Used when the user asks a question.
     *
     * User questions use RETRIEVAL_QUERY.
     */
    public float[] generateQueryEmbedding(String text) {

        GoogleGenAiTextEmbeddingOptions options =
                GoogleGenAiTextEmbeddingOptions.builder()
                        .model("gemini-embedding-001")
                        .taskType(
                                GoogleGenAiTextEmbeddingOptions.TaskType.RETRIEVAL_QUERY
                        )
                        .dimensions(768)
                        .build();

        EmbeddingRequest request =
                new EmbeddingRequest(
                        List.of(text),
                        options
                );

        EmbeddingResponse response =
                embeddingModel.call(request);

        return response
                .getResults()
                .get(0)
                .getOutput();
    }
}