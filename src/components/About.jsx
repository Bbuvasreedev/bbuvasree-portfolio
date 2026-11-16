import { useEffect, useState } from "react";
import Reveal, { useInView } from "./Reveal";
import SectionHead from "./SectionHead";
import { ABOUT_TEXT, ABOUT_EXTRA, STATS } from "../data/portfolioData";

// The lines shown in the developer.js card
const CODE = `const developer = {

  name: "Bbuvasree N",
  role: "Software Developer",

  stack: [
    "Java",
    "Spring Boot",
    "Python",
    "Django",
    "JavaScript",
    "React",
    "Dart",
    "Flutter",
    "SQL",
    "postgreSQL",   
    "REST APIs"
  ],

  genAI: [
    "RAG",
    "LLMs",
    "Embeddings",
    "Vector Search",
    "Spring AI",
    "pgvector",
    "Ollama",
    "Prompt Engineering"
  ],
  openToWork: true,
};`.split("\n");

// Colours: strings, keywords, the variable name and "true"
function Colorize({ text }) {
  const parts = text.split(/("[^"]*")|\b(const)\b|\b(developer)\b|\b(true)\b/g);
  return parts.map((p, i) => {
    if (!p) return null;
    if (/^"/.test(p)) return <b key={i} className="s">{p}</b>;
    if (p === "const") return <b key={i} className="k">{p}</b>;
    if (p === "developer") return <b key={i} className="v">{p}</b>;
    if (p === "true") return <b key={i} className="n">{p}</b>;
    return <span key={i}>{p}</span>;
  });
}

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
            <p className="pf-about__text">{ABOUT_EXTRA}</p>
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
              {CODE.map((line, i) => (
                <span
                  className="pf-code__line"
                  key={i}
                  style={{ "--l": (i * 0.35).toFixed(2) }}
                >
                  {line === "" ? " " : <Colorize text={line} />}
                  {i === CODE.length - 1 && <em className="pf-code__caret" />}
                </span>
              ))}
            </code>
          </pre>
        </Reveal>
      </div>
    </section>
  );
}