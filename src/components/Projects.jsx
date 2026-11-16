import { useRef } from "react";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { PROJECTS, MINI_PROJECTS } from "../data/portfolioData";

function ProjectCard({ p, index }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.setProperty("--rx", `${((y / r.height) - 0.5) * -5}deg`);
    el.style.setProperty("--ry", `${((x / r.width) - 0.5) * 5}deg`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      ref={ref}
      className={`pf-card ${p.featured ? "pf-card--featured" : ""}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <span className="pf-card__num">{String(index + 1).padStart(2, "0")}</span>
      <p className="pf-card__tag">{p.tag}</p>
      <h3>{p.name}</h3>
      <p className="pf-card__text">{p.text}</p>
      <div className="pf-tags">
        {p.stack.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="pf-section">
      <SectionHead
        num="04"
        label="Work"
        title={
          <>
            Projects I&apos;m <em>proud</em> of.
          </>
        }
        sub="Full-stack, mobile and GenAI builds, from idea to working product."
      />

      <div className="pf-grid">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.name} delay={(i % 3) * 90}>
            <ProjectCard p={p} index={i} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={120} className="pf-mini">
        <span className="pf-mini__label">Also built</span>
        <div className="pf-tags">
          {MINI_PROJECTS.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}