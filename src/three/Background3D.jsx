import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* Fondo 3D fijo detrás del contenido. Cada "track" (sección) tiene su propio
   escenario; al cambiar de sección se hace un fundido entre escenarios.
   Paleta en escala de grises para mantener el estilo wireframe. */

const GRAY = {
  light: "#c9c9c9",
  mid: "#9a9a9a",
  dark: "#5a5a5a",
  fog: "#f4f4f4",
};

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/* Grupo que aparece/desaparece suavemente según la sección activa */
function FadeGroup({ active, children }) {
  const group = useRef();
  const mats = useRef([]);
  const t = useRef(active ? 1 : 0);

  useEffect(() => {
    const found = [];
    group.current?.traverse((o) => {
      if (o.material) {
        o.material.transparent = true;
        found.push(o.material);
      }
    });
    mats.current = found;
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    t.current = lerp(t.current, active ? 1 : 0, 1 - Math.exp(-4 * dt));
    const v = t.current;
    if (group.current) {
      group.current.visible = v > 0.02;
      group.current.scale.setScalar(lerp(0.7, 1, v));
    }
    for (const m of mats.current) m.opacity = m.userData.baseOpacity * v;
  });

  return <group ref={group}>{children}</group>;
}

/* Material helper: guarda la opacidad base para el fundido */
function useBaseOpacity(ref, opacity) {
  useEffect(() => {
    if (ref.current) ref.current.userData.baseOpacity = opacity;
  }, [ref, opacity]);
}

function Wire({ geo, color = GRAY.dark, opacity = 0.55, ...props }) {
  const mat = useRef();
  useBaseOpacity(mat, opacity);
  return (
    <mesh {...props}>
      {geo}
      <meshBasicMaterial ref={mat} color={color} wireframe transparent opacity={0} />
    </mesh>
  );
}

/* Partículas ambientales compartidas por todos los escenarios */
function Particles({ count = 220, spread = 16 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) arr[i] = (Math.random() - 0.5) * spread;
    return arr;
  }, [count, spread]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color={GRAY.mid} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* Track 01 · Hero: CD gigante girando */
function SceneHero() {
  const disc = useRef();
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (disc.current) disc.current.rotation.z += dt * 0.4;
  });
  return (
    <group ref={disc} rotation={[Math.PI / 3.2, 0, 0]}>
      <Wire geo={<torusGeometry args={[3.2, 0.9, 12, 48]} />} opacity={0.35} />
      <Wire geo={<ringGeometry args={[0.6, 1.4, 32]} />} opacity={0.5} />
      <Wire geo={<ringGeometry args={[1.8, 2.6, 32]} />} opacity={0.4} />
    </group>
  );
}

/* Track 02 · Sobre Mí: esferas flotantes suaves */
function SceneAbout() {
  const group = useRef();
  const spheres = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        pos: [Math.sin(i * 2.1) * 4, Math.cos(i * 1.7) * 2.2, Math.sin(i * 1.3) * 2],
        r: 0.5 + (i % 3) * 0.35,
        speed: 0.3 + i * 0.07,
      })),
    []
  );
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current?.children.forEach((c, i) => {
      c.position.y = spheres[i].pos[1] + Math.sin(t * spheres[i].speed + i) * 0.5;
    });
  });
  return (
    <group ref={group}>
      {spheres.map((s, i) => (
        <Wire key={i} geo={<icosahedronGeometry args={[s.r, 1]} />} position={s.pos} opacity={0.4} />
      ))}
    </group>
  );
}

/* Track 03 · Proyectos: retícula de cubos flotantes */
function SceneProjects() {
  const group = useRef();
  const cubes = useMemo(() => {
    const arr = [];
    for (let x = -2; x <= 2; x++)
      for (let y = -1; y <= 1; y++) arr.push({ pos: [x * 2.4, y * 2.2, -1 - Math.abs(x)], phase: x * 1.3 + y });
    return arr;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current?.children.forEach((c, i) => {
      c.rotation.x = t * 0.25 + cubes[i].phase;
      c.rotation.y = t * 0.2 + cubes[i].phase;
      c.position.y = cubes[i].pos[1] + Math.sin(t * 0.6 + cubes[i].phase) * 0.3;
    });
  });
  return (
    <group ref={group}>
      {cubes.map((c, i) => (
        <Wire key={i} geo={<boxGeometry args={[0.9, 0.9, 0.9]} />} position={c.pos} opacity={0.45} />
      ))}
    </group>
  );
}

/* Track 04 · Habilidades: pilares tipo barras de nivel */
function SceneSkills() {
  const group = useRef();
  const bars = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({ x: (i - 4) * 1.4, h: 1 + ((i * 7) % 5) * 0.8 })),
    []
  );
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current?.children.forEach((c, i) => {
      const s = 1 + Math.sin(t * 0.8 + i * 0.9) * 0.15;
      c.scale.y = s;
      c.position.y = (bars[i].h * s) / 2 - 2.5;
    });
  });
  return (
    <group ref={group} position={[0, 0, -2]}>
      {bars.map((b, i) => (
        <Wire key={i} geo={<cylinderGeometry args={[0.35, 0.35, b.h, 8]} />} position={[b.x, 0, 0]} opacity={0.45} />
      ))}
    </group>
  );
}

/* Track 05 · Experiencia: hélice vertical tipo línea de tiempo */
function SceneTimeline() {
  const group = useRef();
  const rings = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        pos: [Math.sin(i * 0.9) * 2.2, (i - 4.5) * 0.9, Math.cos(i * 0.9) * 2.2],
      })),
    []
  );
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (group.current) group.current.rotation.y += dt * 0.3;
  });
  return (
    <group position={[0, 0, -3]} scale={0.7}>
      <group ref={group}>
        {rings.map((r, i) => (
          <Wire key={i} geo={<torusGeometry args={[0.5, 0.12, 8, 24]} />} position={r.pos} opacity={0.32} />
        ))}
      </group>
    </group>
  );
}

/* Track 06 · Contacto: nudo central envolvente */
function SceneContact() {
  const knot = useRef();
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (knot.current) {
      knot.current.rotation.x += dt * 0.25;
      knot.current.rotation.y += dt * 0.35;
    }
  });
  return (
    <group position={[0, 0, -4]} scale={0.8}>
      <group ref={knot}>
        <Wire geo={<torusKnotGeometry args={[1.8, 0.5, 64, 8]} />} opacity={0.2} />
      </group>
      <Wire geo={<sphereGeometry args={[3.6, 10, 8]} />} opacity={0.05} />
    </group>
  );
}

const SCENES = [SceneHero, SceneAbout, SceneProjects, SceneSkills, SceneTimeline, SceneContact];

export default function Background3D({ track }) {
  return (
    <div className="bg3d" aria-hidden="true">
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 50 }}
        onCreated={({ gl }) => gl.domElement.closest(".bg3d")?.setAttribute("data-scene-ready", "true")}
      >
        <fog attach="fog" args={[GRAY.fog, 10, 22]} />
        <ambientLight intensity={0.8} />
        <Particles />
        {SCENES.map((Scene, i) => (
          <FadeGroup key={i} active={track === i}>
            <Scene />
          </FadeGroup>
        ))}
      </Canvas>
    </div>
  );
}
