import { useState } from "react";
import Reveal from "../components/Reveal";
import SectionHead from "./SectionHead";
import { PROFILE } from "../data/portfolioData";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the mailto button still works */
    }
  };

  return (
    <section id="contact" className="pf-section pf-section--last">
      <SectionHead num="06" label="Contact" title={<>Let&apos;s build something <em>remarkable</em>.</>} />

      <Reveal delay={100} className="pf-contact">
        <div className="pf-contact__inner">
          <p className="pf-contact__lead">
            I&apos;m open to Java Full Stack Developer and Software Engineering
            roles. Tell me what you&apos;re building, or ask my Digital Mind
            anything with the <b>Decode Me</b> button.
          </p>

          <div className="pf-contact__actions">
            <a className="pf-btn pf-btn--primary" href={`mailto:${PROFILE.email}`}>
              Send an email <span>→</span>
            </a>
            <button className="pf-btn pf-btn--ghost" onClick={copyEmail}>
              {copied ? "Copied ✓" : "Copy email"}
            </button>
            <a className="pf-btn pf-btn--ghost" href={PROFILE.resume} download>
              Download résumé ↓
            </a>
          </div>

          <div className="pf-contact__grid">
            <a href={`mailto:${PROFILE.email}`}>
              <small>Email</small>
              <span>{PROFILE.email}</span>
            </a>
            <a href={`tel:${PROFILE.phone}`}>
              <small>Phone</small>
              <span>{PROFILE.phone}</span>
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
              <small>LinkedIn</small>
              <span>Connect with me ↗</span>
            </a>
            <a href={PROFILE.github} target="_blank" rel="noreferrer">
              <small>GitHub</small>
              <span>See my code ↗</span>
            </a>
          </div>

          <p className="pf-contact__loc">📍 {PROFILE.location}</p>
        </div>
      </Reveal>

      <footer className="pf-footer">
        <span>© {new Date().getFullYear()} {PROFILE.name}</span>
        
      </footer>
    </section>
  );
}