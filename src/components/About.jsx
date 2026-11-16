import { useEffect, useState } from "react";
import Reveal, { useInView } from "../components/Reveal";
import SectionHead from "./SectionHead";
import { ABOUT_TEXT, PROFILE, STATS } from "../data/portfolioData";

function CountUp({ to, suffix = "" }) {
  const [ref, inView] = useInView(0.4);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }
    let raf;
    let start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / 1400, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="pf-section">
      <SectionHead
        num="01"
        label="About me"
        title={
          <>
            Turning ideas into <em>scalable</em> software.
          </>
        }
      />

      <div className="pf-about">
        <div>
          <Reveal delay={80}>
            <p className="pf-about__lead">{ABOUT_TEXT}</p>
          </Reveal>
          <Reveal delay={160}>
            <p className="pf-about__text">
              I enjoy the full journey of a product: designing the database,
              building clean REST APIs, crafting responsive interfaces and now
              teaching software to reason over knowledge with GenAI. Adaptable,
              curious and always learning.
            </p>
          </Reveal>

          <div className="pf-stats">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={220 + i * 90} className="pf-stat">
                <strong>
                  <CountUp to={s.n} suffix={s.suffix} />
                </strong>
                <span>{s.label}</span>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={200} className="pf-code">
          <div className="pf-code__bar">
            <i /> <i /> <i />
            <span>developer.js</span>
          </div>
          <pre className="pf-code__body">
            <code>
              <span className="pf-code__line" style={{ "--l": 0 }}>
                <b className="k">const</b> <b className="v">developer</b> = {"{"}
              </span>
              <span className="pf-code__line" style={{ "--l": 1 }}>
                {"  "}name: <b className="s">"{PROFILE.name}"</b>,
              </span>
              <span className="pf-code__line" style={{ "--l": 2 }}>
                {"  "}role: <b className="s">"{PROFILE.role}"</b>,
              </span>
              <span className="pf-code__line" style={{ "--l": 3 }}>
                {"  "}stack: [<b className="s">"Java"</b>, <b className="s">"Spring Boot"</b>,
              </span>
              <span className="pf-code__line" style={{ "--l": 4 }}>
                {"    "}<b className="s">"React"</b>, <b className="s">"Django"</b>, <b className="s">"Flutter"</b>],
              </span>
              <span className="pf-code__line" style={{ "--l": 5 }}>
                {"  "}genAI: [<b className="s">"RAG"</b>, <b className="s">"pgvector"</b>, <b className="s">"Ollama"</b>],
              </span>
              <span className="pf-code__line" style={{ "--l": 6 }}>
                {"  "}education: <b className="s">"B.E. CSBS · 2026"</b>,
              </span>
              <span className="pf-code__line" style={{ "--l": 7 }}>
                {"  "}openToWork: <b className="n">true</b>,
              </span>
              <span className="pf-code__line" style={{ "--l": 8 }}>
                {"}"};<em className="pf-code__caret" />
              </span>
            </code>
          </pre>
        </Reveal>
      </div>
    </section>
  );
}