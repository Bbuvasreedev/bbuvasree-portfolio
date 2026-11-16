import Reveal from "../components/Reveal";

export default function SectionHead({ num, label, title, sub }) {
  return (
    <Reveal className="pf-head">
      <p className="pf-head__eyebrow">
        <b>{num}</b> {label}
      </p>
      <h2 className="pf-head__title">{title}</h2>
      {sub && <p className="pf-head__sub">{sub}</p>}
    </Reveal>
  );
}