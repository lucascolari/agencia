"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Objeto de marca del loader: un icosaedro que se ensambla (escala desde 0 con
 * rebote) y gira, como un logo tomando forma. Placeholder hasta tener el logo
 * real de gular en 3D. Vive solo durante el loader.
 */
function Shape() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += dt * 0.5;
    mesh.current.rotation.y += dt * 0.8;
    // Entrada con easeOutBack (rebote sutil).
    const t = Math.min(state.clock.elapsedTime / 0.9, 1);
    const c1 = 1.70158;
    const c3 = c1 + 1;
    const eased = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    mesh.current.scale.setScalar(eased * 1.15);
  });

  return (
    <mesh ref={mesh} scale={0}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#e4ff3f"
        metalness={0.2}
        roughness={0.35}
        flatShading
      />
    </mesh>
  );
}

export default function LoaderScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#5b6cff" />
      <Shape />
    </Canvas>
  );
}
