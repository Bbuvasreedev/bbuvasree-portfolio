import { useEffect, useRef } from "react";
import Reveal from "../components/Reveal";
import SectionHead from "./SectionHead";
import { EXPERIENCE } from "../data/portfolioData";

export default function Experience() {
  const lineRef = useRef(null);

  // The glowing line fills as you scroll through the timeline
  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    let raf = null;

    const update = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(
        Math.max((window.innerHeight * 0.65 - r.top) / r.height, 0),
        1
      );
      el.style.setProperty("--p", p.toFixed(4));
      raf = null;
    };
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="experience" className="pf-section">
      <SectionHead
        num="03"
        label="Journey"
        title={
          <>
            Where I&apos;ve <em>built</em> things.
          </>
        }
        sub="Internships and training that shaped how I write, test and ship software."
      />

      <div className="pf-timeline" ref={lineRef}>
        <span className="pf-timeline__rail" />
        <span className="pf-timeline__fill" />

        {EXPERIENCE.map((e, i) => (
          <Reveal key={e.org} delay={60} className="pf-tl">
            <span className={`pf-tl__dot ${e.current ? "is-current" : ""}`} />
            <article className="pf-tl__card">
              <header>
                <div>
                  <h3>{e.role}</h3>
                  <p>{e.org}</p>
                </div>
                <span className={`pf-tl__time ${e.current ? "is-current" : ""}`}>
                  {e.current && <i />}
                  {e.time}
                </span>
              </header>
              <ul>
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="pf-tags">
                {e.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}