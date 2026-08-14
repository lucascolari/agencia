"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { getFeaturedProjects } from "@/lib/content/projects";
import type { Project } from "@/types/content";

const GAP = 2.7;
const PLANE_W = 2.3;
const PLANE_H = (PLANE_W * 9) / 16;

function coverUrl(p: Project): string {
  const c = p.cover;
  if (c.kind === "mux" && c.playbackId) {
    return `https://image.mux.com/${c.playbackId}/thumbnail.jpg?width=900`;
  }
  if (c.kind === "image" && c.src) return c.src;
  return "";
}

function Row() {
  const projects = getFeaturedProjects();
  const textures = useTexture(projects.map(coverUrl));
  const router = useRouter();
  const { size } = useThree();

  const row = useRef<THREE.Group>(null);
  const target = useRef(0);
  const current = useRef(0);
  const velocity = useRef(0);
  const drag = useRef({ active: false, startX: 0, startTarget: 0, moved: 0 });

  const maxX = 0;
  const minX = -(projects.length - 1) * GAP;

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    drag.current = {
      active: true,
      startX: e.clientX,
      startTarget: target.current,
      moved: 0,
    };
    velocity.current = 0;
  };
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (!drag.current.active) return;
    const px = (e.clientX - drag.current.startX) / size.width;
    drag.current.moved = Math.max(
      drag.current.moved,
      Math.abs(e.clientX - drag.current.startX),
    );
    target.current = drag.current.startTarget + px * GAP * projects.length;
  };
  const onUp = () => {
    drag.current.active = false;
  };

  useFrame(() => {
    if (!row.current) return;
    if (!drag.current.active) {
      target.current += velocity.current;
      velocity.current *= 0.9;
    } else {
      velocity.current = target.current - current.current;
    }
    target.current = Math.max(minX, Math.min(maxX, target.current));
    current.current = THREE.MathUtils.lerp(current.current, target.current, 0.12);
    row.current.position.x = current.current;

    // Cada plano rota y se achica según su distancia al centro (efecto arco).
    row.current.children.forEach((child, i) => {
      const worldX = i * GAP + current.current;
      child.rotation.y = -worldX * 0.05;
      const s = 1 - Math.min(Math.abs(worldX) * 0.05, 0.22);
      child.scale.setScalar(s);
      child.position.z = -Math.min(Math.abs(worldX) * 0.25, 1.2);
    });
  });

  return (
    <group>
      {/* Capturador de arrastre: cubre todo, invisible pero recibe el puntero. */}
      <mesh
        position={[0, 0, -2]}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        <planeGeometry args={[60, 30]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group ref={row}>
        {projects.map((p, i) => (
          <mesh
            key={p.slug}
            position={[i * GAP, 0, 0]}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onClick={(e) => {
              e.stopPropagation();
              if (drag.current.moved < 6) router.push(`/work/${p.slug}`);
            }}
          >
            <planeGeometry args={[PLANE_W, PLANE_H]} />
            <meshBasicMaterial map={textures[i]} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function DraggableGallery3DScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 1.75]}>
      <Suspense fallback={null}>
        <Row />
      </Suspense>
    </Canvas>
  );
}
