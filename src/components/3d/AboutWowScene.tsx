"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeasuredCanvas } from "./MeasuredCanvas";

/**
 * Escena WOW de About: un campo de prismas que la cámara atraviesa a medida que
 * avanza el scroll. El progreso (0→1) llega por prop desde el ScrollTrigger del
 * contenedor, así el 3D queda sincronizado con el scroll sin duplicar lógica.
 */
function Field({ progressRef }: { progressRef: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  // Geometría estable: se calcula una vez, no en cada render (pureza).
  // Altura pseudoaleatoria pero determinista a partir del índice.
  const bars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        const radius = 3 + (i % 5) * 0.6;
        const seed = (Math.sin(i * 12.9898) * 43758.5453) % 1;
        return {
          x: Math.cos(angle) * radius,
          y: (((i * 7) % 12) / 12 - 0.5) * 6,
          z: Math.sin(angle) * radius,
          h: 0.6 + Math.abs(seed) * 2.4,
        };
      }),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    const p = progressRef.current ?? 0;
    // La cámara "vuela" hacia adentro con el scroll.
    state.camera.position.z = 8 - p * 12;
    group.current.rotation.y = p * Math.PI * 0.6 + state.clock.elapsedTime * 0.03;
  });

  return (
    <group ref={group}>
      {bars.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]}>
          <boxGeometry args={[0.12, b.h, 0.12]} />
          <meshStandardMaterial
            color={i % 7 === 0 ? "#e4ff3f" : "#f2f0eb"}
            metalness={0.6}
            roughness={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function AboutWowScene({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  return (
    <MeasuredCanvas className="h-full w-full">
      {({ width, height }) => (
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
          style={{ width, height, pointerEvents: "none" }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 6, 4]} intensity={1.8} />
          <directionalLight
            position={[-4, -3, -2]}
            intensity={0.5}
            color="#5b6cff"
          />
          <Field progressRef={progressRef} />
        </Canvas>
      )}
    </MeasuredCanvas>
  );
}
