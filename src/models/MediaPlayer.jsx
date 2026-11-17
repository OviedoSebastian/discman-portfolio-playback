import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useGLTF, useAnimations } from '@react-three/drei'

const MediaPlayer = ({
  track = { n: '01', name: 'Hero', song: 'HOME - Resonance', dur: '0:38' },
  totalTracks = 6,
  playing = false,
  progress = 0,
  timeLabel,
  onPlay,
  onPause,
  onNext,
  onPrev,
  debug = false,
  ...props
}) => {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF(`${import.meta.env.BASE_URL}sansa_clip/scene.gltf`)
  const { actions } = useAnimations(animations, group)

  // Crear canvas y textura una sola vez
  const { canvas, texture } = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 276
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return { canvas: c, texture: tex }
  }, [])

  // Liberar textura y restaurar cursor al desmontar
  useEffect(() => {
    return () => {
      texture.dispose()
      document.body.style.cursor = 'auto'
    }
  }, [texture])

  // Redibujar la pantalla OLED en tiempo real
  useEffect(() => {
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height

    // Fondo oscuro tipo pantalla OLED Sansa Clip
    ctx.fillStyle = '#1b1d24'
    ctx.fillRect(0, 0, w, h)

    // Color de tinta OLED (azul claro / blanco retro)
    const ink = '#b8c7ff'
    ctx.fillStyle = ink
    ctx.strokeStyle = ink

    // --- BARRA SUPERIOR: Batería, Track X/Y y bucle ---
    ctx.lineWidth = 3
    ctx.strokeRect(28, 22, 44, 20)
    ctx.fillRect(72, 27, 5, 10)
    ctx.fillRect(33, 27, 26, 10) // Nivel de carga

    ctx.font = 'bold 20px monospace'
    ctx.textAlign = 'center'
    const totalStr = String(totalTracks).padStart(2, '0')
    ctx.fillText(`${track.n} / ${totalStr}`, w / 2, 39)

    ctx.textAlign = 'right'
    ctx.fillText('↻', w - 28, 40)

    // --- CENTRO: Sección activa y canción en reproducción ---
    ctx.textAlign = 'center'
    ctx.font = 'bold 34px monospace'
    ctx.fillText(track.name.toUpperCase(), w / 2, 120)

    ctx.font = '19px monospace'
    ctx.fillStyle = '#8d9bd6'
    ctx.fillText((track.song || 'SEBASTIAN OVIEDO').toUpperCase(), w / 2, 158)
    ctx.fillText('PORTFOLIO 3D', w / 2, 188)

    // --- BARRA INFERIOR: Estado Play/Pause, progreso real y reloj ---
    ctx.fillStyle = ink
    ctx.textAlign = 'left'
    ctx.font = 'bold 20px monospace'
    ctx.fillText(playing ? '▶' : '❚❚', 28, 244)

    // Marco de barra de progreso
    const barX = 62
    const barY = 229
    const barW = 310
    const barH = 16
    ctx.lineWidth = 2.5
    ctx.strokeRect(barX, barY, barW, barH)

    // Relleno dinámico según el avance real de la canción (0 a 1)
    const clampedProgress = Math.min(1, Math.max(0, progress))
    ctx.fillRect(barX + 3, barY + 3, (barW - 6) * clampedProgress, barH - 6)

    // Tiempo transcurrido o duración total
    ctx.textAlign = 'right'
    ctx.fillText(timeLabel || track.dur, w - 28, 244)

    texture.needsUpdate = true
  }, [canvas, texture, track, totalTracks, playing, progress, timeLabel])

  const handlePointerOver = (e) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto'
  }

  const handleClick = (e, callback) => {
    e.stopPropagation()
    if (callback) callback()
  }

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={0.082}>
          <group name="Mp3_lowfbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group
                  name="Case_low"
                  position={[0.001, 0.861, 0.059]}
                  rotation={[0, -0.014, 0]}
                  scale={0.394}>
                  <mesh
                    name="Case_low_Case_low_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Case_low_Case_low_0.geometry}
                    material={materials.Case_low}
                  />
                </group>

                <group
                  name="Parts_low"
                  position={[0.001, 0.861, 0.059]}
                  rotation={[0, -0.014, 0]}
                  scale={0.394}>
                  <mesh
                    name="Parts_low_Parts_low_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Parts_low_Parts_low_0.geometry}
                    material={materials.Parts_low}
                  />

                  {/* BOTÓN PLAY (Arriba) */}
                  <mesh
                    position={[0, 0.15, 0.72]}
                    onClick={(e) => handleClick(e, onPlay)}
                    onPointerOver={handlePointerOver}
                    onPointerOut={handlePointerOut}>
                    <boxGeometry args={[0.65, 0.55, 0.25]} />
                    <meshBasicMaterial color="lime" transparent opacity={debug ? 0.5 : 0} depthWrite={false} />
                  </mesh>

                  {/* BOTÓN PAUSE (Abajo) */}
                  <mesh
                    position={[0, -1.45, 0.72]}
                    onClick={(e) => handleClick(e, onPause)}
                    onPointerOver={handlePointerOver}
                    onPointerOut={handlePointerOut}>
                    <boxGeometry args={[0.65, 0.55, 0.25]} />
                    <meshBasicMaterial color="red" transparent opacity={debug ? 0.5 : 0} depthWrite={false} />
                  </mesh>

                  {/* BOTÓN ANTERIOR (Izquierda) */}
                  <mesh
                    position={[-0.8, -0.65, 0.72]}
                    onClick={(e) => handleClick(e, onPrev)}
                    onPointerOver={handlePointerOver}
                    onPointerOut={handlePointerOut}>
                    <boxGeometry args={[0.55, 0.65, 0.25]} />
                    <meshBasicMaterial color="cyan" transparent opacity={debug ? 0.5 : 0} depthWrite={false} />
                  </mesh>

                  {/* BOTÓN SIGUIENTE (Derecha) */}
                  <mesh
                    position={[0.8, -0.65, 0.72]}
                    onClick={(e) => handleClick(e, onNext)}
                    onPointerOver={handlePointerOver}
                    onPointerOut={handlePointerOut}>
                    <boxGeometry args={[0.55, 0.65, 0.25]} />
                    <meshBasicMaterial color="yellow" transparent opacity={debug ? 0.5 : 0} depthWrite={false} />
                  </mesh>
                </group>

                <group
                  name="Parts_b_low"
                  position={[0.001, 0.861, 0.059]}
                  rotation={[0, -0.014, 0]}
                  scale={0.394}>
                  <mesh
                    name="Parts_b_low_Parts_b_low_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Parts_b_low_Parts_b_low_0.geometry}
                    material={materials.Parts_b_low}
                  />

                  {/* PANTALLA OLED DINÁMICA */}
                  <mesh position={[0, 1.43, 0.53]}>
                    <planeGeometry args={[2.12, 1.15]} />
                    <meshBasicMaterial map={texture} toneMapped={false} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

export default MediaPlayer