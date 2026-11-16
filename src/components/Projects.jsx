import { useEffect, useRef } from "react";

const AVATAR = encodeURI("/AI image logo.png");

// Layers sit at different depths. The mouse tilts the whole stack,
// so the photo looks like it floats in front of the rings.
export default function Avatar3D() {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);

  // Slow automatic sway on touch screens (no mouse there)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;

    let raf;
    const tick = (t) => {
      stage.style.setProperty("--ry", `${Math.sin(t / 1400) * 14}deg`);
      stage.style.setProperty("--rx", `${Math.cos(t / 1900) * 8}deg`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onMove = (e) => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    stage.style.setProperty("--ry", `${x * 26}deg`);
    stage.style.setProperty("--rx", `${-y * 26}deg`);
  };

  const onLeave = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--ry", "0deg");
    stage.style.setProperty("--rx", "0deg");
  };

  return (
    <div
      ref={wrapRef}
      className="pf-a3d"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div ref={stageRef} className="pf-a3d__stage">
        <span className="pf-a3d__shadow" />
        <span className="pf-a3d__back" />
        <span className="pf-a3d__ring pf-a3d__ring--outer" />
        <span className="pf-a3d__ring pf-a3d__ring--inner" />
        <span
          className="pf-a3d__disc"
          style={{ backgroundImage: `url("${AVATAR}")` }}
          role="img"
          aria-label="Bbuvasree N"
        />
        <span className="pf-a3d__chip pf-a3d__chip--1">RAG</span>
        <span className="pf-a3d__chip pf-a3d__chip--2">pgvector</span>
        <span className="pf-a3d__chip pf-a3d__chip--3">Spring AI</span>
        <span className="pf-a3d__chip pf-a3d__chip--4">Ollama</span>
      </div>
    </div>
  );
}