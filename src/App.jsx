
import AdminKnowledge from "./components/AdminKnowledge";
import AIChatbot from "./components/AIChatbot";
import Landing from "./components/Landing";

import BackgroundVideos from "./components/BackgroundVideos";

import "./App.css";

const SKILLS = {
  Languages: ["Java", "Python", "Dart", "JavaScript", "SQL"],
  Frameworks: ["Spring Boot", "Django", "React JS", "Flutter"],
  Databases: ["MySQL", "PostgreSQL (Supabase)"],
  "Tools & AI": ["Git", "GitHub", "IntelliJ IDEA", "VS Code", "Claude", "GitHub Copilot", "Antigravity"],
};

const EXPERIENCE = [
  {
    role: "Software Engineer Intern",
    org: "Hexaware Technologies",
    time: "Present",
    points: [
      "Building a real-time full-stack web application with Java, Spring Boot and SQL.",
      "Developing REST APIs integrated with a SQL database; working in an Agile team.",
    ],
  },
  {
    role: "Java Full Stack Developer Intern",
    org: "Graquant",
    time: "2 months",
    points: ["Built full-stack applications with Java, Spring Boot, React JS and MySQL."],
  },
  {
    role: "Full-Stack Developer Intern",
    org: "BillionTags",
    time: "2 months",
    points: [
      "Built Django REST endpoints and responsive React JS screens across feature modules.",
      "Debugged frontend and backend issues during integration and pre-deployment testing.",
    ],
  },
  {
    role: "Web Development Intern",
    org: "Apex Planet Software",
    time: "45 days",
    points: ["Built responsive layouts and reusable UI components with HTML and CSS."],
  },
];

const PROJECTS = [
  {
    name: "KaasuTracker",
    stack: "Flutter · Dart · Spring Boot · Supabase",
    text: "Smart expense tracker with AI-powered receipt analysis, EMI and loan tracking, spending alerts and secure REST APIs.",
  },
  {
    name: "Employee Portal",
    stack: "React JS · Django · MySQL",
    text: "Full-stack employee management portal with REST endpoints connected to interactive UI components.",
  },
  {
    name: "Cafe Management Website",
    stack: "Spring Boot · SQL · JavaScript",
    text: "Multi-page cafe site with secure login and role-based access across 7 admin roles, each with its own admin panel.",
  },
  {
    name: "Track My Phone",
    stack: "Java · Android Studio · Google Maps API",
    text: "Android security app to locate and control a lost phone through SMS commands, with SIM-change detection and remote alarm.",
  },
];

export default function App() {
  if (window.location.hash === "#admin") {
  return <AdminKnowledge />;
}
  return (
    <>
      <nav className="nav" aria-label="Primary">
        <a href="#top" className="nav__brand">BN</a>
        <div className="nav__links">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

<main id="top">
  <BackgroundVideos />

  <Landing />

  <AIChatbot />

 

  <section id="about" className="section">
          <h2>About</h2>
          <p className="lead">
            Computer Science and Business Systems graduate who builds scalable full-stack
            applications with Java, Spring Boot, React and Django. Adaptable, curious, and
            comfortable across frontend, backend and mobile.
          </p>
          <div className="skills">
            {Object.entries(SKILLS).map(([group, items]) => (
              <div key={group} className="skills__group">
                <h3>{group}</h3>
                <ul>{items.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" className="section">
          <h2>Experience</h2>
          {EXPERIENCE.map((e) => (
            <article key={e.org} className="item">
              <header>
                <h3>{e.role} · {e.org}</h3>
                <span>{e.time}</span>
              </header>
              <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </article>
          ))}
        </section>

        <section id="projects" className="section">
          <h2>Projects</h2>
          <div className="cards">
            {PROJECTS.map((p) => (
              <article key={p.name} className="card">
                <h3>{p.name}</h3>
                <p className="card__stack">{p.stack}</p>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section">
          <h2>Contact</h2>
          <p className="lead">Open to Java Full Stack Developer roles.</p>
          <p>
            <a className="btn" href="mailto:bbuvasree.n@gmail.com">bbuvasree.n@gmail.com</a>
          </p>
          <p className="muted">Chennai, Tamil Nadu · 7395963845</p>
        </section>
      </main>
    </>
  );
}