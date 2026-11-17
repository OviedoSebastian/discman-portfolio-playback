import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, Environment, OrbitControls } from "@react-three/drei";
import { education, experience, languages, tools } from "../data/portfolioData";
import Background3D from "../three/Background3D";
import MediaPlayer from "../models/MediaPlayer.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diskman Portfolio — Wireframes Desktop & Mobile" },
      { name: "description", content: "Wireframes low/mid fidelity de un portafolio web 3D navegable con un reproductor 3D interactivo." },
      { property: "og:title", content: "Diskman Portfolio — Wireframes" },
      { property: "og:description", content: "Portafolio interactivo: cada pista es una sección." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

// Resuelve automáticamente las rutas relativas "../audio/*.mp3" al compilar con Vite
const AUDIO_MODULES = import.meta.glob("../audio/*.mp3", {
  eager: true,
  import: "default",
});

const getAudioSrc = (fileName) =>
  AUDIO_MODULES[`../audio/${fileName}`] ?? `${import.meta.env.BASE_URL}audio/${fileName}`;

const TRACKS = [
  { n: "01", id: "hero", name: "Hero", song: "HOME - Resonance", dur: "0:38", src: getAudioSrc("Resonance - Home.mp3") },
  { n: "02", id: "about", name: "Sobre Mí", song: "BoC - Roygbiv", dur: "0:46", src: getAudioSrc("Roygbiv - Boards of Canada.mp3") },
  { n: "03", id: "projects", name: "Proyectos", song: "Daft Punk - Veridis Quo", dur: "1:08", src: getAudioSrc("Daft Punk - Veridis Quo.mp3") },
  { n: "04", id: "skills", name: "Habilidades", song: "Aphex Twin - Alberto Balsalm", dur: "0:41", src: getAudioSrc("Alberto Balsalm - Aphex Twin.mp3") },
  { n: "05", id: "timeline", name: "Experiencia", song: "Bonobo - Kiara", dur: "1:10", src: getAudioSrc("Kiara - Bonobo.mp3") },
  { n: "06", id: "contact", name: "Contacto", song: "HOME - Finally Landing", dur: "1:14", src: getAudioSrc("We're Finally Landing - Release.mp3") },
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
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

function Player3D({ idx, setIdx, playing, setPlaying, setMuted, progress, timeLabel, mounted }) {
  const currentTrack = TRACKS[idx] ?? TRACKS[0];

  const go = (d) => {
    const ni = (idx + d + TRACKS.length) % TRACKS.length;
    setIdx(ni);
    scrollTo(TRACKS[ni].id);
  };

  return (
    <div style={{ width: "100%", height: 420, background: "transparent" }}>
      {mounted && (
        <Canvas
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0, 4.5], fov: 35 }}
          dpr={[1, 2]}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 5]} intensity={1.2} />
          <Suspense fallback={null}>
            <Environment preset="city" />
          </Suspense>

          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.05}
          />

          <Suspense fallback={null}>
            <Center>
              <MediaPlayer
                scale={16}
                track={currentTrack}
                totalTracks={TRACKS.length}
                playing={playing}
                progress={progress}
                timeLabel={timeLabel}
                onPlay={() => {
                  setMuted(false);
                  setPlaying(true);
                }}
                onPause={() => setPlaying(false)}
                onNext={() => go(1)}
                onPrev={() => go(-1)}
              />
            </Center>
          </Suspense>
        </Canvas>
      )}
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
  const [muted, setMuted] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLabel, setTimeLabel] = useState(TRACKS[0].dur);

  const audioRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // 1. Inicializar reproductor de audio en el navegador
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
        setTimeLabel(formatTime(audio.currentTime));
      }
    };

    const onLoadedMetadata = () => {
      if (audio.duration) {
        setTimeLabel(formatTime(audio.duration));
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  // 2. Cambiar canción al cambiar de pista o hacer scroll entre secciones
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const track = TRACKS[idx] ?? TRACKS[0];
    const resolvedSrc = AUDIO_MODULES[track.src] ?? track.src;
    const absoluteSrc = new URL(resolvedSrc, window.location.origin).href;

    setProgress(0);
    setTimeLabel(track.dur);

    if (audio.src !== absoluteSrc) {
      audio.src = resolvedSrc;
      audio.load();
    }

    if (playing) {
      audio.play().catch(() => setPlaying(false));
    }
  }, [idx]);

  // 3. Reproducir o pausar
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing]);

  // 4. Silenciar / activar sonido desde el botón del header
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  /* El escenario 3D sigue la sección visible al hacer scroll */
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 4) {
        setIdx(TRACKS.length - 1);
        return;
      }
      const mark = window.scrollY + window.innerHeight * 0.45;
      let current = 0;
      TRACKS.forEach((t, i) => {
        const el = document.getElementById(t.id);
        if (el && el.offsetTop <= mark) current = i;
      });
      setIdx(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {mounted && (
        <Suspense fallback={null}>
          <Background3D track={idx} />
        </Suspense>
      )}
      <div className="page">
        <header className="header">
          <button
            type="button"
            onClick={() => {
              setIdx(0);
              scrollTo("hero");
            }}
            className="header-logo"
            title="Volver al inicio"
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}favicon.jpg`}
              alt="Sebastian Oviedo Logo"
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                objectFit: "cover",
                display: "block",
              }}
            />
          </button>

          <div className="header-status">
            {playing ? "● Playing:" : "❚❚ Paused:"} Track {TRACKS[idx].n} {TRACKS[idx].name}
          </div>
          <button type="button" onClick={() => setMuted((m) => !m)} className="header-btn">
            {muted ? "🔇 Mute" : "🔊 Sound"}
          </button>
          <nav className="header-nav">
            {TRACKS.slice(1).map((t, i) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIdx(i + 1);
                  scrollTo(t.id);
                }}
              >
                {t.name}
              </a>
            ))}
          </nav>
          <button type="button" className="header-btn header-burger">☰</button>
        </header>

        <section id="hero" className="hero">
          <div className="hero-info">
            <Note>Overlay · Información principal</Note>
            <h1 className="hero-title">Sebastian<br />Oviedo</h1>
            <p className="hero-role">TECNÓLOGO EN DESARROLLO DE SOFTWARE - ESTUDIANTE ING DE SISTEMAS</p>
            <p className="hero-tagline">Web 3D e interacción táctil: dándole presencia física al código</p>
            <div className="hero-actions">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  setIdx(2);
                  scrollTo("projects");
                }}
                className="btn-primary"
              >
                Ver Proyectos
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  setIdx(5);
                  scrollTo("contact");
                }}
                className="btn-outline"
              >
                Contactar
              </a>
            </div>
          </div>
          <div className="hero-diskman">
            <Player3D
              idx={idx}
              setIdx={setIdx}
              playing={playing}
              setPlaying={setPlaying}
              setMuted={setMuted}
              progress={progress}
              timeLabel={timeLabel}
              mounted={mounted}
            />
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
                      <div className="skill-bars">
                        {[0, 1, 2, 3, 4].map((k) => (
                          <span key={k} className={`skill-bar ${k < 5 - (i % 3) ? "filled" : ""}`} />
                        ))}
                      </div>
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
              <ul className="contact-list">
                <li>
                  <a href="mailto:juan.sebastian.oviedo@correounivalle.edu.co">
                    ✉ juan.sebastian.oviedo@correounivalle.edu.co
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/sebastian-oviedo-0bb7a120b/" target="_blank" rel="noreferrer">
                    in LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://github.com/OviedoSebastian" target="_blank" rel="noreferrer">
                    ⌥ GitHub
                  </a>
                </li>
              </ul>
              <div>
                <Note>Disponibilidad</Note>
                <p>Disponible para trabajo remoto · Cali / Jamundí, Colombia</p>
              </div>
            </div>
          </div>
        </Section>
        <footer className="footer">© Sebastian Oviedo · End of Disc</footer>
      </div>
    </>
  );
}