import { useEffect, useRef } from "react";
import "./LandingHero.css";

const SCENE = encodeURI("/Land page image/Mine Land page.png");

// Where her face sits inside the picture (fractions of width / height)
const FACE_X = 0.48;
const FACE_Y = 0.22;

// Look range from the cursor (degrees of "look")
const MAX_YAW = 8;
const MAX_PITCH = 5;

function LandingHero() {
  const figureRef = useRef(null);
  const headRef = useRef(null);

  useEffect(() => {
    const figure = figureRef.current;
    const head = headRef.current;
    if (!figure || !head) return;

    // No mouse on touch devices; respect reduced motion
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let mouseX = null;
    let mouseY = null;
    let yaw = 0;
    let pitch = 0;
    let rafId;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const tick = () => {
      let targetYaw = 0;
      let targetPitch = 0;

      if (mouseX !== null) {
        const r = figure.getBoundingClientRect();
        const faceX = r.left + r.width * FACE_X;
        const faceY = r.top + r.height * FACE_Y;

        // -1 .. 1 relative to half the window
        let nx = clamp((mouseX - faceX) / (window.innerWidth / 2), -1, 1);
        let ny = clamp((mouseY - faceY) / (window.innerHeight / 2), -1, 1);

        // Dead zone: cursor near her face = neutral position
        const dead = 0.08;
        nx = Math.abs(nx) < dead ? 0 : nx;
        ny = Math.abs(ny) < dead ? 0 : ny;

        targetYaw = nx * MAX_YAW;
        targetPitch = ny * MAX_PITCH;
      }

      // Lerp so the head never jumps
      yaw += (targetYaw - yaw) * 0.07;
      pitch += (targetPitch - pitch) * 0.07;

      // Convert "look" into a small, seamless 2D movement of the head layer only
      const tx = yaw * 0.5;            // px  (max about 4px)
      const ty = pitch * 0.6;          // px  (max about 3px)
      const rot = yaw * 0.25;          // deg (max about 2deg)

      head.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(
        2
      )}px, 0) rotate(${rot.toFixed(2)}deg)`;

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="hero" id="home">
      <div
        className="hero__backdrop"
        style={{ backgroundImage: `url("${SCENE}")` }}
        aria-hidden="true"
      />
      <div className="hero__overlay" aria-hidden="true" />

      <div ref={figureRef} className="hero__figure">
        {/* Stationary body, chair, laptop, desk */}
        <img
          className="hero__layer"
          src={SCENE}
          alt="Bhuvasree, Java Full Stack Developer, at her desk"
        />
        {/* Soft-edged copy of only her head, moves slightly toward the cursor */}
        <img
          ref={headRef}
          className="hero__layer hero__head"
          src={SCENE}
          alt=""
          aria-hidden="true"
        />
      </div>

      <div className="hero__text">
        <p className="hero__eyebrow">Software Developer</p>
        <h1 className="hero__title">
          Hi, I&apos;m <span>Bhuvasree</span>
        </h1>
        <h2 className="hero__role">Java Full Stack Developer</h2>
        <p className="hero__desc">
          I build scalable web applications with Java, Spring Boot, React, AI
          and modern cloud technologies.
        </p>
        <div className="hero__actions">
          <a className="hero__btn hero__btn--primary" href="#projects">
            View My Work
          </a>
          <a className="hero__btn hero__btn--ghost" href="#contact">
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}

export default LandingHero;