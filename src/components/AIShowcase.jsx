import Reveal from "./Reveal";

const POINTER = encodeURI("/Pointing decode me.png");

// Conversation starters (the visitor can type anything else in the chat)
const QUESTIONS = [
  "What projects have you worked on?",
  "What are your strongest technical skills?",
  "Tell me about your experience",
  "How did you build this AI?",
];

const openChat = (question = "") =>
  window.dispatchEvent(new CustomEvent("open-ai-chat", { detail: { question } }));

export default function AIShowcase() {
  return (
    <section id="ai" className="pf-section pf-ai-section">
      <Reveal className="pf-ai">
        <span className="pf-ai__sheen" aria-hidden="true" />

        <div className="pf-ai__copy">
          <p className="pf-ai__badge">
            <i /> Live demo · RAG-powered · built by me
          </p>

          <h2 className="pf-ai__title">
            Don&apos;t just read my portfolio. <em>Talk to it.</em>
          </h2>

          <p className="pf-ai__text">
            I built an AI version of myself. It reads my projects, skills and
            experience from a knowledge base, finds the right context with
            vector search, and answers in seconds. Ask it anything a recruiter
            would ask me.
          </p>

          <div className="pf-ai__chips">
            {QUESTIONS.map((q) => (
              <button key={q} type="button" onClick={() => openChat(q)}>
                {q}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="pf-btn pf-btn--cream"
            onClick={() => openChat("")}
          >
            Ask AI <span>→</span>
          </button>
        </div>

        {/* Standalone character pointing at the Decode Me button */}
        <div className="pf-ai__visual pf-pointer">
          <img
            className="pf-pointer__img"
            src={POINTER}
            alt="Pointing to the Decode Me button"
            draggable="false"
          />
        </div>
      </Reveal>
    </section>
  );
}