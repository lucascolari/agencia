"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { getAudioBands } from "@/lib/audio/audioReactive";
import { getScrollSignals, stepWarp } from "@/lib/motion/scrollSignals";

/**
 * Campo de estrellas de fondo. Deriva muy lento y hace parallax sutil hacia el
 * puntero: da sensación de estar flotando en el espacio. Con reduced-motion
 * queda estático. Geometría de puntos: liviana para el GPU.
 */
function Field({ reduced, lite }: { reduced: boolean; lite: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!group.current || reduced) return;
    pointer.current.x = THREE.MathUtils.lerp(
      pointer.current.x,
      state.pointer.x,
      0.03,
    );
    pointer.current.y = THREE.MathUtils.lerp(
      pointer.current.y,
      state.pointer.y,
      0.03,
    );
    // Cuando el usuario activa el sonido, todo el espacio reacciona: la deriva se
    // acelera con el nivel general y late (escala) con los graves. Sin audio,
    // level/bass son 0 y queda el movimiento de siempre.
    const { level, bass } = getAudioBands();

    // Mundo reactivo (B3) + warp entre páginas (A1). `velocity`/`warp` son función
    // pura de su señal actual, así que el campo siempre vuelve a su lugar solo.
    stepWarp();
    const { velocity, warp } = getScrollSignals();

    group.current.rotation.y +=
      0.0003 * (1 + level * 6 + velocity * 4 + warp * 20);
    group.current.rotation.x = pointer.current.y * 0.12;
    group.current.rotation.z = pointer.current.x * 0.08;
    // Al scrollear rápido —y sobre todo en el warp— el campo se acerca a la
    // cámara: las estrellas pasan de largo y se siente el "salto espacial".
    group.current.position.z = velocity * 6 + warp * 34;
    const pulse = 1 + bass * 0.14 + warp * 0.25;
    group.current.scale.setScalar(pulse);
  });

  return (
    <group ref={group}>
      <Stars
        radius={90}
        depth={60}
        count={lite ? 2200 : 4500}
        factor={4}
        saturation={0}
        fade
        speed={reduced ? 0 : 0.5}
      />
    </group>
  );
}

export default function SpaceScene({
  reduced,
  lite = false,
}: {
  reduced: boolean;
  lite?: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 1], fov: 60 }}
      dpr={lite ? 1 : [1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <Field reduced={reduced} lite={lite} />
    </Canvas>
  );
}
