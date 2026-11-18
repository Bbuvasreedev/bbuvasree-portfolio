package rag_backend.controller;

import rag_backend.service.RagService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"https://vermillion-malasada-bb6c41.netlify.app", "http://localhost:5173", "http://localhost:3000"})
public class ChatController {

    private final RagService ragService;

    public ChatController(RagService ragService) {
        this.ragService = ragService;
    }

    @PostMapping("/chat")
    public ChatResponse chat(
            @RequestBody ChatRequest request) {

        String answer =
                ragService.askQuestion(
                        request.question()
                );

        return new ChatResponse(answer);
    }

    public record ChatRequest(
            String question
    ) {
    }

    public record ChatResponse(
            String answer
    ) {
    }
}