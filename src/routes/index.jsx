import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { education, experience, languages, tools } from "../data/portfolioData";
import Background3D from "../three/Background3D";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diskman Portfolio — Wireframes Desktop & Mobile" },
      { name: "description", content: "Wireframes low/mid fidelity de un portafolio web 3D navegable con un Diskman interactivo." },
      { property: "og:title", content: "Diskman Portfolio — Wireframes" },
      { property: "og:description", content: "Portafolio interactivo: cada CD es una sección." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const TRACKS = [
  { n: "01", id: "hero", name: "Hero", dur: "0:42", shade: "#bfbfbf" },
  { n: "02", id: "about", name: "Sobre Mí", dur: "2:15", shade: "#a6a6a6" },
  { n: "03", id: "projects", name: "Proyectos", dur: "4:08", shade: "#8c8c8c" },
  { n: "04", id: "skills", name: "Habilidades", dur: "3:21", shade: "#737373" },
  { n: "05", id: "timeline", name: "Experiencia", dur: "3:47", shade: "#595959" },
  { n: "06", id: "contact", name: "Contacto", dur: "1:30", shade: "#404040" },
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Note({ children }) {
  return <span className="wf-note">{children}</span>;
}

function Box({ label, className = "" }) {
  return (
    <div className={`wf-box ${className}`}>
      <span className="wf-note wf-note-pad">{label}</span>
    </div>
  );
}

function CD({ shade, n, spinning, size = 160 }) {
  return (
    <div
      className={`cd ${spinning ? "cd-spin" : ""}`}
      style={{ width: size, height: size, background: `repeating-radial-gradient(circle, ${shade} 0 4px, var(--muted) 4px 6px)` }}
    >
      <div className="cd-hole">{n}</div>
    </div>
  );
}

function CtrlBtn({ label, onClick, active }) {
  return (
    <button onClick={onClick} className={`ctrl-btn ${active ? "active" : ""}`}>
      {label}
    </button>
  );
}

function Diskman({ idx, setIdx, playing, setPlaying, open, setOpen }) {
  const t = TRACKS[idx];
  const go = (d) => {
    const ni = (idx + d + TRACKS.length) % TRACKS.length;
    setIdx(ni);
    scrollTo(TRACKS[ni].id);
  };
  return (
    <div className="diskman">
      <div className="diskman-tag"><Note>Canvas 3D · Diskman · {open ? "Abierto" : playing ? "Reproduciendo" : "Cerrado"}</Note></div>
      {open ? (
        <div className="diskman-tray">
          {TRACKS.map((tr, i) => (
            <button key={tr.n} onClick={() => { setIdx(i); setOpen(false); scrollTo(tr.id); }}
              className={`tray-item ${i === idx ? "active" : ""}`}>
              <CD shade={tr.shade} n={tr.n} size={72} />
              <Note>{tr.name}</Note>
            </button>
          ))}
        </div>
      ) : (
        <div className="diskman-stage"><CD shade={t.shade} n={t.n} spinning={playing} size={200} /></div>
      )}
      <div className="lcd">
        <div className="lcd-row"><span>TRACK {t.n}/06</span><span>{playing ? "▶" : "❚❚"} {t.dur}</span></div>
        <div className="lcd-track">{t.name}</div>
      </div>
      <div className="controls">
        <CtrlBtn label="⏮" onClick={() => go(-1)} />
        <CtrlBtn label={playing ? "❚❚" : "▶"} active={playing} onClick={() => setPlaying(!playing)} />
        <CtrlBtn label="⏭" onClick={() => go(1)} />
        <CtrlBtn label="⏏" active={open} onClick={() => setOpen(!open)} />
      </div>
    </div>
  );
}

function Section({ id, n, title, children }) {
  return (
    <section id={id} className="section">
      <div className="wrap">
        <Note>Track {n}</Note>
        <h2 className="section-title">{title}</h2>
        {children}
      </div>
    </section>
  );
}

const Line = ({ w = "100%" }) => <div className="wf-line" style={{ width: w }} />;

function Index() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  /* El escenario 3D sigue la sección visible al hacer scroll */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = TRACKS.findIndex((t) => t.id === e.target.id);
            if (i >= 0) setIdx(i);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    TRACKS.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setIdx((i) => {
        const ni = (i + 1) % TRACKS.length;
        scrollTo(TRACKS[ni].id);
        return ni;
      });
    }, 4000);
    return () => clearInterval(t);
  }, [playing]);

  return (
    <>
      {mounted && <Background3D track={idx} />}
      <div className="page">
      <header className="header">
        <div className="header-logo">LOGO</div>
        <div className="header-status">● Playing: Track {TRACKS[idx].n} - {TRACKS[idx].name}</div>
        <button onClick={() => setMuted(!muted)} className="header-btn">{muted ? "🔇 Mute" : "🔊 Sound"}</button>
        <nav className="header-nav">
          {TRACKS.slice(1).map((t, i) => (
            <a key={t.id} href={`#${t.id}`} onClick={() => setIdx(i + 1)}>{t.name}</a>
          ))}
        </nav>
        <button className="header-btn header-burger">☰</button>
      </header>

      <section id="hero" className="hero">
        <div className="hero-info">
          <Note>Overlay · Información principal</Note>
          <h1 className="hero-title">Sebastian<br />Oviedo</h1>
          <p className="hero-role">TECNÓLOGO EN DESARROLLO DE SOFTWARE - ESTUDIANTE ING DE SISTEMAS</p>
          <p className="hero-tagline">Web 3D e interacción táctil: dándole presencia física al código</p>
          <div className="hero-actions">
            <a href="#projects" onClick={() => setIdx(2)} className="btn-primary">Ver Proyectos</a>
            <a href="#contact" onClick={() => setIdx(5)} className="btn-outline">Contactar</a>
          </div>
        </div>
        <div className="hero-diskman">
          <Diskman {...{ idx, setIdx, playing, setPlaying, open, setOpen }} />
        </div>
      </section>

      <Section id="about" n="02" title="Sobre Mí">
        <div className="grid grid-2" style={{ gap: 40 }}>
          <Box label="Foto / Avatar 3D" className="aspect-square" />
          <div className="stack">
            {["Perfil profesional", "Formación académica", "Resolución de problemas", "Objetivos a futuro"].map((h) => (
              <div key={h} className="stack-sm"><h3 className="card-title">{h}</h3><Line /><Line w="80%" /></div>
            ))}
          </div>
        </div>
        <div className="grid grid-2 mt-10">
          {["Proyectos personales destacados", "Filosofía de aprendizaje"].map((h) => (
            <div key={h} className="card stack-sm"><Note>Tarjeta secundaria</Note><h3 className="card-title">{h}</h3><Line /><Line w="60%" /></div>
          ))}
        </div>
      </Section>

      <Section id="projects" n="03" title="Proyectos">
        <div className="grid grid-projects">
          {[1, 2, 3, 4, 5, 6].map((p) => (
            <article key={p} className="card project-card">
              <Box label="Captura / 3D / Video" className="aspect-video" />
              <h3 className="card-title mt-4">Proyecto {p}</h3>
              <p className="project-desc">Breve descripción del proyecto.</p>
              <div className="stack-sm mt-3"><Note>Problema</Note><Line w="90%" /><Note>Aporte personal</Note><Line w="70%" /></div>
              <div className="badges">{["React", "Three.js", "TS"].map((b) => <span key={b} className="badge">{b}</span>)}</div>
              <div className="project-actions">
                <button className="project-btn primary">Ver Sitio</button>
                <button className="project-btn outline">GitHub</button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="skills" n="04" title="Habilidades Técnicas">
        <div className="grid grid-3">
          {[
            ["Frontend", ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Three.js"]],
            ["Backend & BD", ["Python", "Node.js", "PostgreSQL"]],
            ["Herramientas", ["Git", "GitHub", "Docker", "APIs REST", "Blender"]],
          ].map(([cat, items]) => (
            <div key={cat} className="card">
              <h3 className="card-title mb-4">{cat}</h3>
              <ul className="skill-list">
                {items.map((s, i) => (
                  <li key={s}>
                    <div className="skill-row"><span>{s}</span><Note>Nivel</Note></div>
                    <div className="skill-bars">{[0, 1, 2, 3, 4].map((k) => <span key={k} className={`skill-bar ${k < 5 - (i % 3) ? "filled" : ""}`} />)}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="timeline" n="05" title="Experiencia y Formación">
        <div className="grid grid-2" style={{ gap: 40 }}>
          <div>
            <h3 className="card-title mb-4">Experiencia laboral</h3>
            <ol className="timeline">
              {experience.map((e) => (
                <li key={e.role + e.date}>
                  <span className="timeline-dot" />
                  <Note>{e.date} · {e.city}</Note>
                  <h3 className="card-title">{e.role}</h3>
                  <p className="project-desc">{e.company}</p>
                  <ul className="project-desc" style={{ paddingLeft: 18, marginTop: 6 }}>
                    {e.tasks.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  {e.reference && <p className="project-desc"><Note>Referencia</Note> {e.reference}</p>}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="card-title mb-4">Formación académica</h3>
            <ol className="timeline">
              {education.map((e) => (
                <li key={e.title}>
                  <span className="timeline-dot" />
                  <Note>{e.date} · {e.city}</Note>
                  <h3 className="card-title">{e.title}</h3>
                  <p className="project-desc">{e.place}</p>
                </li>
              ))}
            </ol>
            <div className="grid grid-2 mt-10">
              <div className="card">
                <h3 className="card-title mb-4">Idiomas</h3>
                {languages.map((l) => <div key={l.name} className="skill-row"><span>{l.name}</span><Note>{l.level}</Note></div>)}
              </div>
              <div className="card">
                <h3 className="card-title mb-4">Ofimática</h3>
                {tools.map((l) => <div key={l.name} className="skill-row"><span>{l.name}</span><Note>{l.level}</Note></div>)}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="contact" n="06" title="Contacto">
        <div className="grid grid-2" style={{ gap: 40 }}>
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            {["Nombre", "Email"].map((l) => <label key={l}>{l}<input /></label>)}
            <label>Mensaje<textarea rows={5} /></label>
            <div><button className="btn-primary">Enviar</button></div>
          </form>
          <div className="stack">
            <p className="contact-cta">¿Construimos algo juntos?</p>
            <ul className="contact-list">{["✉ correo@ejemplo.com", "in LinkedIn", "⌥ GitHub"].map((s) => <li key={s}>{s}</li>)}</ul>
            <div><Note>Disponibilidad</Note><p>Disponible para trabajo remoto · Ciudad, País</p></div>
          </div>
        </div>
      </Section>
      <footer className="footer">© Nombre Apellido · End of Disc</footer>
      </div>
    </>
  );
}
