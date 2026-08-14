"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

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
    group.current.rotation.y += 0.0003;
    group.current.rotation.x = pointer.current.y * 0.12;
    group.current.rotation.z = pointer.current.x * 0.08;
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
