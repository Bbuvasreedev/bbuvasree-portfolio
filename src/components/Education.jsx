import Reveal from "../components/Reveal";
import SectionHead from "./SectionHead";
import {
  EDUCATION,
  CERTIFICATIONS,
  ACHIEVEMENTS,
  SOFT_SKILLS,
  LANGUAGES,
} from "../data/portfolioData";

export default function Education() {
  return (
    <section id="education" className="pf-section">
      <SectionHead
        num="05"
        label="Foundation"
        title={
          <>
            Learning that <em>keeps going</em>.
          </>
        }
      />

      <div className="pf-trio">
        <Reveal delay={0} className="pf-panel">
          <h3>Education</h3>
          <ul className="pf-list">
            {EDUCATION.map((e) => (
              <li key={e.title}>
                <strong>{e.title}</strong>
                <span>{e.place}</span>
                <em>{e.time}</em>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100} className="pf-panel">
          <h3>Certifications</h3>
          <ul className="pf-list pf-list--plain">
            {CERTIFICATIONS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={200} className="pf-panel">
          <h3>Achievements</h3>
          <ul className="pf-list pf-list--plain">
            {ACHIEVEMENTS.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="pf-duo">
        <Reveal delay={120} className="pf-panel pf-panel--row">
          <h3>Soft skills</h3>
          <div className="pf-tags">
            {SOFT_SKILLS.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={200} className="pf-panel pf-panel--row">
          <h3>Languages</h3>
          <div className="pf-tags">
            {LANGUAGES.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}