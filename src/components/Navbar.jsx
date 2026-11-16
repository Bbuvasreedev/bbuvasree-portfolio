import { useEffect, useRef, useState } from "react";

const LINKS = [
  ["about", "About"],
  ["ai", "Ask AI"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["education", "Education"],
  ["contact", "Contact"],
];

export default function Navbar() {
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      setScrolled(window.scrollY > 40);

      let current = LINKS[0][0];
      for (const [id] of LINKS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 180) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`pf-nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}
      role="navigation"
      aria-label="Primary"
    >
      <span className="pf-nav__bar" ref={barRef} aria-hidden="true" />

      <a href="#top" className="pf-nav__brand" onClick={() => setOpen(false)}>
        BBUVASREE N<i />
      </a>

      <div className="pf-nav__links">
        {LINKS.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className={`${active === id ? "is-active" : ""} ${
              id === "ai" ? "pf-nav__ai" : ""
            }`}
            onClick={() => setOpen(false)}
          >
            {id === "ai" && <b>✦</b>}
            {label}
          </a>
        ))}
      </div>

      <button
        className="pf-nav__burger"
        aria-label="Toggle menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
      </button>
    </div>
  );
}