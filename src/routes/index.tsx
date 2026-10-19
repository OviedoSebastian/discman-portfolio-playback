import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
  { n: "01", id: "hero", name: "Hero", dur: "0:42", shade: "oklch(0.75 0 0)" },
  { n: "02", id: "about", name: "Sobre Mí", dur: "2:15", shade: "oklch(0.65 0 0)" },
  { n: "03", id: "projects", name: "Proyectos", dur: "4:08", shade: "oklch(0.55 0 0)" },
  { n: "04", id: "skills", name: "Habilidades", dur: "3:21", shade: "oklch(0.45 0 0)" },
  { n: "05", id: "timeline", name: "Experiencia", dur: "3:47", shade: "oklch(0.35 0 0)" },
  { n: "06", id: "contact", name: "Contacto", dur: "1:30", shade: "oklch(0.25 0 0)" },
];

function Note({ children }: { children: React.ReactNode }) {
  return <span className="wf-note">{children}</span>;
}

function Box({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`wf-x relative flex items-center justify-center border border-dashed border-border ${className}`}>
      <span className="wf-note bg-card px-2 py-1">{label}</span>
    </div>
  );
}

function CD({ shade, n, spinning, size = 160 }: { shade: string; n: string; spinning?: boolean; size?: number }) {
  return (
    <div
      className={`relative rounded-full border-2 border-foreground/40 ${spinning ? "cd-spin" : ""}`}
      style={{ width: size, height: size, background: `repeating-radial-gradient(circle, ${shade} 0 4px, var(--muted) 4px 6px)` }}
    >
      <div className="absolute inset-[36%] flex items-center justify-center rounded-full border border-border bg-card font-mono text-[10px]">
        {n}
      </div>
    </div>
  );
}

function CtrlBtn({ label, onClick, active }: { label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`h-12 min-w-12 rounded-full border-2 border-foreground/50 px-3 font-mono text-xs transition hover:bg-muted active:translate-y-px active:bg-placeholder ${active ? "bg-primary text-primary-foreground hover:bg-primary" : "bg-card"}`}
    >
      {label}
    </button>
  );
}

function Diskman({ idx, setIdx, playing, setPlaying, open, setOpen }: any) {
  const t = TRACKS[idx];
  const go = (d: number) => {
    const ni = (idx + d + TRACKS.length) % TRACKS.length;
    setIdx(ni);
    document.getElementById(TRACKS[ni].id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="relative w-full max-w-md rounded-[2.5rem] border-2 border-dashed border-foreground/40 bg-card p-6">
      <div className="absolute -top-3 left-6 bg-background px-2"><Note>Canvas 3D · Diskman · {open ? "Abierto" : playing ? "Reproduciendo" : "Cerrado"}</Note></div>
      {open ? (
        <div className="grid grid-cols-3 gap-3 py-4">
          {TRACKS.map((tr, i) => (
            <button key={tr.n} onClick={() => { setIdx(i); setOpen(false); document.getElementById(tr.id)?.scrollIntoView({ behavior: "smooth" }); }}
              className={`flex flex-col items-center gap-1 rounded-xl p-2 hover:bg-muted ${i === idx ? "bg-muted" : ""}`}>
              <CD shade={tr.shade} n={tr.n} size={72} />
              <Note>{tr.name}</Note>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex justify-center py-4"><CD shade={t.shade} n={t.n} spinning={playing} size={200} /></div>
      )}
      <div className="mt-2 rounded-lg border-2 border-foreground/50 bg-lcd p-3 font-mono text-sm">
        <div className="flex justify-between"><span>TRACK {t.n}/06</span><span>{playing ? "▶" : "❚❚"} {t.dur}</span></div>
        <div className="mt-1 truncate text-lg font-semibold uppercase">{t.name}</div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <CtrlBtn label="⏮" onClick={() => go(-1)} />
        <CtrlBtn label={playing ? "❚❚" : "▶"} active={playing} onClick={() => setPlaying(!playing)} />
        <CtrlBtn label="⏭" onClick={() => go(1)} />
        <CtrlBtn label="⏏" active={open} onClick={() => setOpen(!open)} />
      </div>
    </div>
  );
}

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-t border-dashed border-border px-5 py-20 md:px-16">
      <div className="mx-auto max-w-6xl">
        <Note>Track {n}</Note>
        <h2 className="mb-10 mt-1 text-3xl font-bold md:text-4xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}

const Line = ({ w = "100%" }: { w?: string }) => <div className="h-2.5 rounded bg-placeholder" style={{ width: w }} />;

function Index() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setIdx((i) => {
        const ni = (i + 1) % TRACKS.length;
        document.getElementById(TRACKS[ni].id)?.scrollIntoView({ behavior: "smooth" });
        return ni;
      });
    }, 4000);
    return () => clearInterval(t);
  }, [playing]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-card/90 px-5 py-3 backdrop-blur md:px-16">
        <div className="flex h-9 w-9 items-center justify-center rounded border border-dashed border-foreground/50 font-mono text-xs">LOGO</div>
        <div className="flex-1 truncate font-mono text-xs md:text-center">● Playing: Track {TRACKS[idx].n} - {TRACKS[idx].name}</div>
        <button onClick={() => setMuted(!muted)} className="rounded border border-border px-2 py-1 font-mono text-xs hover:bg-muted">{muted ? "🔇 Mute" : "🔊 Sound"}</button>
        <nav className="hidden gap-4 text-sm lg:flex">
          {TRACKS.slice(1).map((t, i) => (
            <a key={t.id} href={`#${t.id}`} onClick={() => setIdx(i + 1)} className="hover:underline">{t.name}</a>
          ))}
        </nav>
        <button className="rounded border border-border px-2 py-1 font-mono text-xs lg:hidden">☰</button>
      </header>

      <section id="hero" className="grid min-h-[88vh] items-center gap-12 px-5 py-16 md:px-16 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <Note>Overlay · Información principal</Note>
          <h1 className="mt-3 text-5xl font-bold leading-none md:text-7xl">Nombre<br />Apellido</h1>
          <p className="mt-4 font-mono text-sm uppercase">Desarrollador Web Frontend / Web 3D</p>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">Frase corta de valor: construyo experiencias web que se sienten como objetos.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" onClick={() => setIdx(2)} className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Ver Proyectos</a>
            <a href="#contact" onClick={() => setIdx(5)} className="rounded-md border-2 border-foreground px-5 py-3 text-sm font-medium">Contactar</a>
          </div>
        </div>
        <div className="order-1 flex justify-center lg:order-2">
          <Diskman {...{ idx, setIdx, playing, setPlaying, open, setOpen }} />
        </div>
      </section>

      <Section id="about" n="02" title="Sobre Mí">
        <div className="grid gap-10 md:grid-cols-2">
          <Box label="Foto / Avatar 3D" className="aspect-square rounded-2xl" />
          <div className="space-y-6">
            {["Perfil profesional", "Formación académica", "Resolución de problemas", "Objetivos a futuro"].map((h) => (
              <div key={h} className="space-y-2"><h3 className="font-semibold">{h}</h3><Line /><Line w="80%" /></div>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {["Proyectos personales destacados", "Filosofía de aprendizaje"].map((h) => (
            <div key={h} className="space-y-2 rounded-xl border border-border bg-card p-6"><Note>Tarjeta secundaria</Note><h3 className="font-semibold">{h}</h3><Line /><Line w="60%" /></div>
          ))}
        </div>
      </Section>

      <Section id="projects" n="03" title="Proyectos">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((p) => (
            <article key={p} className="group rounded-xl border border-border bg-card p-4 transition hover:-translate-y-1 hover:border-foreground hover:shadow-lg">
              <Box label="Captura / 3D / Video" className="aspect-video rounded-lg" />
              <h3 className="mt-4 font-semibold">Proyecto {p}</h3>
              <p className="text-sm text-muted-foreground">Breve descripción del proyecto.</p>
              <div className="mt-3 space-y-1"><Note>Problema</Note><Line w="90%" /><Note>Aporte personal</Note><Line w="70%" /></div>
              <div className="mt-3 flex flex-wrap gap-1">{["React", "Three.js", "TS"].map((b) => <span key={b} className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px]">{b}</span>)}</div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded bg-primary py-2 text-xs text-primary-foreground">Ver Sitio</button>
                <button className="flex-1 rounded border border-foreground py-2 text-xs">GitHub</button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="skills" n="04" title="Habilidades Técnicas">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Frontend", ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Three.js"]],
            ["Backend & BD", ["Python", "Node.js", "PostgreSQL"]],
            ["Herramientas", ["Git", "GitHub", "Docker", "APIs REST", "Blender"]],
          ].map(([cat, items]) => (
            <div key={cat as string} className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold">{cat as string}</h3>
              <ul className="space-y-3">
                {(items as string[]).map((s, i) => (
                  <li key={s}>
                    <div className="flex justify-between text-sm"><span>{s}</span><Note>Nivel</Note></div>
                    <div className="mt-1 flex gap-1">{[0, 1, 2, 3, 4].map((k) => <span key={k} className={`h-2 flex-1 rounded ${k < 5 - (i % 3) ? "bg-foreground/60" : "bg-placeholder"}`} />)}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="timeline" n="05" title="Experiencia y Formación">
        <ol className="relative ml-3 space-y-8 border-l-2 border-dashed border-foreground/40">
          {[["2025 — Hoy", "Experiencia laboral", "Rol · Empresa"], ["2024", "Prácticas", "Rol · Empresa"], ["2020 — 2024", "Formación universitaria", "Carrera · Universidad"], ["2023", "Cursos y certificaciones", "Certificación · Entidad"]].map(([d, k, r]) => (
            <li key={k} className="ml-6">
              <span className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full border-2 border-foreground bg-card" />
              <Note>{d} · {k}</Note>
              <h3 className="font-semibold">{r}</h3>
              <div className="mt-2 max-w-xl space-y-1"><Line /><Line w="75%" /></div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="contact" n="06" title="Contacto">
        <div className="grid gap-10 md:grid-cols-2">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {["Nombre", "Email"].map((l) => <label key={l} className="block text-sm">{l}<input className="mt-1 w-full rounded border border-border bg-card px-3 py-2" /></label>)}
            <label className="block text-sm">Mensaje<textarea rows={5} className="mt-1 w-full rounded border border-border bg-card px-3 py-2" /></label>
            <button className="rounded-md bg-primary px-6 py-3 text-sm text-primary-foreground">Enviar</button>
          </form>
          <div className="space-y-6">
            <p className="text-2xl font-bold">¿Construimos algo juntos?</p>
            <ul className="space-y-2 font-mono text-sm">{["✉ correo@ejemplo.com", "in LinkedIn", "⌥ GitHub"].map((s) => <li key={s} className="rounded border border-border bg-card px-3 py-2">{s}</li>)}</ul>
            <div><Note>Disponibilidad</Note><p>Disponible para trabajo remoto · Ciudad, País</p></div>
          </div>
        </div>
      </Section>
      <footer className="border-t border-border px-5 py-6 text-center font-mono text-xs text-muted-foreground">© Nombre Apellido · End of Disc</footer>
    </div>
  );
}
