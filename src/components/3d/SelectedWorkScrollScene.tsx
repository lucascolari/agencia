"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useTransitionRouter } from "next-view-transitions";
import * as THREE from "three";
import { useMemo } from "react";
import { getProjects } from "@/lib/content/projects";
import type { Project } from "@/types/content";

const DEPTH = 7;
const VIEW_DIST = 5.5; // distancia a la que la cámara se para frente a cada portada
const PLANE_W = 2.6;

function coverUrl(p: Project): string {
  const c = p.cover;
  if (c.kind === "mux" && c.playbackId) {
    return `https://image.mux.com/${c.playbackId}/thumbnail.jpg?width=900`;
  }
  if (c.kind === "image" && c.src) return c.src;
  return "";
}

function Corridor({ progressRef }: { progressRef: React.RefObject<number> }) {
  const projects = getProjects();
  const textures = useTexture(projects.map(coverUrl));
  const router = useTransitionRouter();
  const group = useRef<THREE.Group>(null);

  const total = projects.length;

  // Posición de cada portada: onda suave (carrusel) con leve subibaja.
  const positions = useMemo(
    () =>
      projects.map((_, i) => ({
        x: Math.sin(i * 0.8) * 2.0,
        y: Math.sin(i * 1.4 + 0.5) * 0.6,
        z: -i * DEPTH,
      })),
    [projects],
  );

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    // "Estación" continua: la cámara se para de frente a cada portada y pasa
    // suave a la siguiente, así cada trabajo se ve completo y centrado.
    const s = p * (total - 1);
    const i0 = Math.floor(s);
    const i1 = Math.min(i0 + 1, total - 1);
    const f = s - i0;
    const cx = THREE.MathUtils.lerp(positions[i0].x, positions[i1].x, f);
    const cy = THREE.MathUtils.lerp(positions[i0].y, positions[i1].y, f);
    const cz = THREE.MathUtils.lerp(positions[i0].z, positions[i1].z, f);

    state.camera.position.set(cx, cy, cz + VIEW_DIST);
    state.camera.lookAt(cx, cy, cz);

    // Flotación sutil de cada portada.
    const t = state.clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      child.position.y = child.userData.baseY + Math.sin(t * 0.5 + i) * 0.1;
    });
  });

  return (
    <group ref={group}>
      {projects.map((p, i) => {
        const { x, y: baseY } = positions[i];
        // Ancho fijo; alto según el formato real de cada imagen (sin estirar).
        const img = textures[i].image as { width?: number; height?: number };
        const ratio = img?.width && img?.height ? img.width / img.height : 16 / 9;
        const w = PLANE_W;
        const h = w / ratio;
        return (
          <mesh
            key={p.slug}
            position={[x, baseY, -i * DEPTH]}
            userData={{ baseY }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/work/${p.slug}`);
            }}
            onPointerOver={() => {
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "";
            }}
          >
            <planeGeometry args={[w, h]} />
            <meshBasicMaterial map={textures[i]} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function SelectedWorkScrollScene({
  progressRef,
  lite = false,
}: {
  progressRef: React.RefObject<number>;
  lite?: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 50 }}
      dpr={lite ? 1 : [1, 1.5]}
    >
      <Suspense fallback={null}>
        <Corridor progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
