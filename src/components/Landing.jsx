import { useEffect, useRef, useState } from "react";
import "./Landing.css";

const FIRST = "BBUVASREE";
const LAST = "N";
const ROLE_A = "Full Stack Software Developer".split(" ");
const ROLE_B = "Web & Mobile Application Developer".split(" ");
const PHOTO = encodeURI("/Land page image/Mine Land page.png");

// 14 faint floating lights (fixed values so they don't change on re-render)
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: 2 + (i % 3),
  delay: `${(i % 7) * 0.8}s`,
  duration: `${9 + (i % 5) * 2}s`,
}));

function Landing() {
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef(null);

  // On every load/refresh: start from the very top, ignore the old scroll position and #hash
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash && window.location.hash !== "#admin") {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Lock page scroll while the intro is showing, and hide the AI chat
  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("landing-active");
    return () => {
      document.body.style.overflow = previous;
      document.body.classList.remove("landing-active");
    };
  }, [visible]);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 900);
  };

  // Enter key, scrolling down, or swiping up all open the portfolio
  useEffect(() => {
    if (!visible) return;
    let touchY = null;

    const onKey = (e) => {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") enter();
    };
    const onWheel = (e) => {
      if (e.deltaY > 20) enter();
    };
    const onTouchStart = (e) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (touchY !== null && touchY - e.touches[0].clientY > 50) enter();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  });

  // Subtle cursor interaction: updates CSS variables only (no React re-renders)
  useEffect(() => {
    if (!visible) return;
    const root = rootRef.current;
    if (!root) return;
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let tx = 0, ty = 0, cx = 0, cy = 0, rafId;
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      root.style.setProperty("--mx", `${(e.clientX / window.innerWidth) * 100}%`);
      root.style.setProperty("--my", `${(e.clientY / window.innerHeight) * 100}%`);
    };
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      root.style.setProperty("--px", cx.toFixed(3));
      root.style.setProperty("--py", cy.toFixed(3));
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className={`landing ${leaving ? "landing--leaving" : ""}`}
    >
      {/* Ambient background */}
      <div className="landing__ambient" aria-hidden="true">
        <div className="landing__blue" />
        <div className="landing__ember" />
        <div className="landing__spot" />
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="landing__particle"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* Character: enters from the right, parallax on cursor */}
      <div className="landing__heroWrap">
        <div className="landing__heroParallax">
          <img className="landing__photo" src={PHOTO} alt="BBUVASREE N" />
        </div>
      </div>
      <div className="landing__shade" aria-hidden="true" />

      {/* Text */}
      <div className="landing__content">
        <div className="landing__parallax">
          <span className="landing__badge">
            <span className="landing__dot" />
            Available for Software Engineering Opportunities
          </span>

          <p className="landing__hello">Hello, I&apos;m</p>

          <h1 className="landing__nameSlide" aria-label={`${FIRST} ${LAST}`}>
            <span className="landing__name" aria-hidden="true">
              {FIRST.split("").map((ch, i) => (
                <span
                  key={i}
                  className="landing__letter"
                  style={{ "--i": i }}
                >
                  {ch}
                </span>
              ))}
              <span className="landing__letter landing__letter--space">
                &nbsp;
              </span>
              <span
                className="landing__letter landing__letter--accent"
                style={{ "--i": FIRST.length + 1 }}
              >
                {LAST}
              </span>
            </span>
          </h1>

          <div className="landing__line" aria-hidden="true" />

          <h2 className="landing__roles">
            <span className="landing__roleGroup landing__roleGroup--a">
              {ROLE_A.map((w, i) => (
                <span key={i} className="landing__word" style={{ "--w": i }}>
                  {w}
                </span>
              ))}
            </span>
            <span className="landing__divider" aria-hidden="true" />
            <span className="landing__roleGroup landing__roleGroup--b">
              {ROLE_B.map((w, i) => (
                <span
                  key={i}
                  className="landing__word"
                  style={{ "--w": i + ROLE_A.length }}
                >
                  {w}
                </span>
              ))}
            </span>
          </h2>

          <p className="landing__summary">
            I build elegant digital experiences with code, creativity, and
            technology.
          </p>

          <button className="landing__button" onClick={enter}>
            <span>Explore My Work</span>
            <span className="landing__arrow">→</span>
          </button>
        </div>
      </div>

      <div className="landing__scroll" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </div>
  );
}

export default Landing;