import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { SKILL_GROUPS } from "../data/portfolioData";

export default function Skills() {
  return (
    <section id="skills" className="pf-section">
      <SectionHead
        num="02"
        label="Toolbox"
        title={
          <>
            Skills that <em>ship</em> products.
          </>
        }
        sub="From databases to LLM pipelines: the technologies I use to take an idea to production."
      />

      <div className="pf-skills">
        {SKILL_GROUPS.map((g, i) => (
          <Reveal key={g.title} delay={i * 80} className="pf-skill">
            <div className="pf-skill__top">
              <span className="pf-skill__icon">{g.icon}</span>
              <h3>{g.title}</h3>
            </div>
            <ul>
              {g.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}