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
    state.camera.position.x = Math.sin(p * Math.PI * 2) * 0.4;
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
        // Carrusel que fluye: onda suave a los lados + leve subibaja, todas
        // cerca del centro para que siempre se vean bien.
        const x = Math.sin(i * 0.8) * 2.4;
        const baseY = Math.sin(i * 1.4 + 0.5) * 0.7;
        return (
          <mesh
            key={p.slug}
            position={[x, baseY, -i * DEPTH]}
            rotation={[0, -x * 0.14, 0]}
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
