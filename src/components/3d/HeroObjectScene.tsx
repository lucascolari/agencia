"use client";

import { useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { MeasuredCanvas } from "./MeasuredCanvas";

/**
 * Objeto de marca 3D. Un icosaedro facetado de aspecto metálico que gira lento
 * y responde con parallax sutil al puntero: se lee como un objeto físico
 * premium, no como una demo técnica. Geometría mínima, sin texturas pesadas.
 *
 * Es el módulo pesado: se carga por dynamic import y solo cuando el dispositivo
 * lo permite (ver Hero3D).
 */
function Knot(props: ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += 0.0015;
    mesh.current.rotation.z += 0.0006;
    // Parallax suave hacia el puntero.
    pointer.current.x = THREE.MathUtils.lerp(
      pointer.current.x,
      state.pointer.x * 0.35,
      0.04,
    );
    pointer.current.y = THREE.MathUtils.lerp(
      pointer.current.y,
      state.pointer.y * 0.35,
      0.04,
    );
    mesh.current.rotation.x = pointer.current.y;
    mesh.current.rotation.y += pointer.current.x * 0.002;
  });

  return (
    <mesh ref={mesh} {...props}>
      <icosahedronGeometry args={[1.15, 0]} />
      {/* metalness bajo: sin env-map, un metal alto se ve negro. Las luces
          direccionales bastan para leer las facetas y el color de marca. */}
      <meshStandardMaterial
        color="#e4ff3f"
        metalness={0.2}
        roughness={0.35}
        flatShading
      />
    </mesh>
  );
}

export default function HeroObjectScene() {
  return (
    <MeasuredCanvas className="h-full w-full">
      {({ width, height }) => (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
          style={{ width, height, pointerEvents: "none" }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 4, 5]} intensity={2.2} />
          <directionalLight
            position={[-5, -2, -3]}
            intensity={0.6}
            color="#5b6cff"
          />
          <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.6}>
            <Knot position={[2.2, 0.6, 0]} />
          </Float>
        </Canvas>
      )}
    </MeasuredCanvas>
  );
}
