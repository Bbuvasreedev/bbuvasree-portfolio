import { useState } from "react";
import "./AIChatbot.css";

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm Bbuvasree's AI portfolio assistant. Ask me about her skills, experience, projects, or technologies.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: trimmedQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the AI assistant.");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I couldn't connect to the AI assistant right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askQuestion();
    }
  };

  return (
    <>
      <button
        className={`ai-chat-button ${isOpen ? "ai-chat-button--open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open AI portfolio assistant"
      >
        {isOpen ? "×" : "AI"}
      </button>

      {isOpen && (
        <div className="ai-chat">
          <div className="ai-chat__header">
            <div>
              <div className="ai-chat__title">
                Bbuvasree&apos;s AI Assistant
              </div>

              <div className="ai-chat__status">
                <span />
                Online
              </div>
            </div>
          </div>

          <div className="ai-chat__messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`ai-chat__message ${
                  message.role === "user"
                    ? "ai-chat__message--user"
                    : "ai-chat__message--assistant"
                }`}
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div className="ai-chat__message ai-chat__message--assistant">
                <span className="ai-chat__typing">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}
          </div>

          <div className="ai-chat__input-area">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Bbuvasree..."
              rows={1}
              disabled={loading}
            />

            <button
              onClick={askQuestion}
              disabled={!question.trim() || loading}
              aria-label="Send question"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;