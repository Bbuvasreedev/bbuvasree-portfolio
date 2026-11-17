import { useEffect, useRef, useState } from "react";
import "./AIChatbot.css";

const AVATAR = encodeURI("/AI image logo.png");        // thinking character
const BUTTON_LOGO = encodeURI("/Bottom logo.png");     // Decode Me button

const WELCOME =
  "Hmm... what would you like to know?\nAsk me anything about my work, projects, skills, experience, and the technology behind them.";

// Sent to the backend with every question so the answer comes back in first person.
// Best fix is in your Spring Boot system prompt (see my notes). After you add it there,
// set this to "" so the question stays clean for the vector search.
const PERSONA_HINT =
  "\n\n[Answer as Bbuvasree N speaking directly to the visitor, in first person (I, my, me). Never say she or her. Use only the portfolio knowledge.]";

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hintGone, setHintGone] = useState(false);
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: WELCOME },
  ]);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("hidden");

  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  // "Ask AI" section and nav open the chat through this event
  useEffect(() => {
    const onOpen = (e) => {
      setIsOpen(true);
      setHintGone(true);
      const q = e.detail && e.detail.question;
      if (q) setPending(q);
    };
    window.addEventListener("open-ai-chat", onOpen);
    return () => window.removeEventListener("open-ai-chat", onOpen);
  }, []);

  // Quick questions are sent straight away
  useEffect(() => {
    if (pending && isOpen && !loading) {
      sendQuestion(pending);
      setPending("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, isOpen, loading]);

  // Escape closes the chat
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Character only shows after a question is sent
  useEffect(() => {
    if (loading) {
      setPhase("thinking");
      return;
    }
    setPhase((prev) => (prev === "thinking" ? "returning" : prev));
  }, [loading]);

  useEffect(() => {
    if (phase !== "returning") return;
    const timer = setTimeout(() => setPhase("hidden"), 480);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, isOpen, phase]);

  useEffect(() => {
    if (!loading && isOpen && inputRef.current) inputRef.current.focus();
  }, [loading, isOpen]);

  // Freeze the portfolio behind the chat while it is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const sendQuestion = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("https://bbuvasree-portfolio.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed + PERSONA_HINT }),
      });

      if (!response.ok) throw new Error("Failed to connect to the AI assistant.");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I couldn't connect right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendQuestion(question);
    }
  };

  const characterClass = [
    "ai-character-thinking",
    phase === "thinking" &&
      "ai-character-thinking--visible ai-character-thinking--thinking",
    phase === "returning" && "ai-character-thinking--returning",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {!isOpen && !hintGone && (
        <div className="ai-chat-hint">Ask my AI about me ✦</div>
      )}

      {/* Click anywhere outside the chat to close it */}
      {isOpen && (
        <div
          className="ai-chat-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <button
        className={`ai-chat-button ${isOpen ? "ai-chat-button--open" : ""}`}
        onClick={() => {
          setIsOpen((prev) => !prev);
          setHintGone(true);
        }}
        aria-label="Open the portfolio assistant"
      >
        <img className="ai-avatar-img" src={BUTTON_LOGO} alt="" draggable="false" />
        <span className="ai-chat-button__label">
          {isOpen ? "Back to Portfolio" : "Decode Me"}
        </span>
      </button>

      {isOpen && (
        <div className="ai-chat" role="dialog" aria-label="Chat with Bbuvasree">
          <div className="ai-chat__header">
            <div>
              <div className="ai-chat__title">Bbuvasree&apos;s Digital Mind</div>
              <div className="ai-chat__status">
                <span className="ai-chat__spark">✦</span>
                {loading ? "Thinking it through..." : "Ready when you are"}
              </div>
            </div>

            <button
              type="button"
              className="ai-chat__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div
            className={`ai-chat__messages ${
              phase !== "hidden" ? "ai-chat__messages--lifted" : ""
            }`}
            ref={messagesRef}
            onWheel={(e) => e.stopPropagation()}
          >
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
          </div>

          <div className="ai-chat__input-area">
            <div className={characterClass} aria-hidden="true">
              <img
                className="ai-character-thinking__img"
                src={AVATAR}
                alt=""
                draggable="false"
              />
              <div className="ai-character-thinking__dots">
                <i />
                <i />
                <i />
                <span>Thinking...</span>
              </div>
            </div>

            <textarea
              ref={inputRef}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What are you curious about?"
              rows={1}
              disabled={loading}
            />

            <button
              onClick={() => sendQuestion(question)}
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