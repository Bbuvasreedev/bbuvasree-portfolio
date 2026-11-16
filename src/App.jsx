import AdminKnowledge from "./components/AdminKnowledge";
import AIChatbot from "./components/AIChatbot";
import Landing from "./components/Landing";
import BackgroundVideos from "./components/BackgroundVideos";

import Navbar from "./components/Navbar";
import CursorGlow from "./components/CursorGlow";
import About from "./components/About";
import AIShowcase from "./components/AIShowcase";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Contact from "./components/Contact";

import "./Portfolio.css";

export default function App() {
  if (window.location.hash === "#admin") {
    return <AdminKnowledge />;
  }

  return (
    <>
      <Navbar />
      <CursorGlow />

      <main id="top">
        <BackgroundVideos />
        <Landing />
        <AIChatbot />

        <div className="pf-root">
          <About />
          <AIShowcase />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Contact />
        </div>
      </main>
    </>
  );
}