"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { getProjects } from "@/lib/content/projects";
import type { Project } from "@/types/content";

const DEPTH = 7;
const PLANE_W = 2.6;
const PLANE_H = (PLANE_W * 9) / 16;

function coverUrl(p: Project): string {
  const c = p.cover;
  if (c.kind === "mux" && c.playbackId) {
    return `https://image.mux.com/${c.playbackId}/thumbnail.jpg?width=900`;
  }
  if (c.kind === "image" && c.src) return c.src;
  return "";
}

// Pseudoaleatorio determinista (0..1) a partir de una semilla: scatter estable.
function rand(seed: number): number {
  const s = Math.sin(seed * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

function Corridor({ progressRef }: { progressRef: React.RefObject<number> }) {
  const projects = getProjects();
  const textures = useTexture(projects.map(coverUrl));
  const router = useRouter();
  const group = useRef<THREE.Group>(null);

  const total = projects.length;
  const startZ = 5;
  const endZ = -(total - 1) * DEPTH - 5;

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    // La cámara vuela hacia adentro: las portadas vienen hacia el visitante.
    state.camera.position.z = THREE.MathUtils.lerp(startZ, endZ, p);
    state.camera.position.x = Math.sin(p * Math.PI * 3) * 0.6;
    state.camera.position.y = Math.cos(p * Math.PI * 2) * 0.4;
    state.camera.lookAt(0, 0, state.camera.position.z - 6);

    // Flotación sutil de cada portada.
    const t = state.clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      child.position.y = child.userData.baseY + Math.sin(t * 0.5 + i) * 0.14;
    });
  });

  return (
    <group ref={group}>
      {projects.map((p, i) => {
        // Desparramadas por toda la pantalla (no en fila): X e Y dispersos.
        const x = (rand(i * 2 + 1) - 0.5) * 8;
        const baseY = (rand(i * 2 + 2) - 0.5) * 5;
        return (
          <mesh
            key={p.slug}
            position={[x, baseY, -i * DEPTH]}
            rotation={[0, -x * 0.1, 0]}
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
            <planeGeometry args={[PLANE_W, PLANE_H]} />
            <meshBasicMaterial map={textures[i]} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function SelectedWorkScrollScene({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} dpr={[1, 1.75]}>
      <Suspense fallback={null}>
        <Corridor progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
