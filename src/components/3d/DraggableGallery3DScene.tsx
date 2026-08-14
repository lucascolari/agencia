"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { getFeaturedProjects } from "@/lib/content/projects";
import type { Project } from "@/types/content";

const GAP = 2.7;
const PLANE_W = 2.3;
const PLANE_H = (PLANE_W * 9) / 16;

type DragState = {
  deltaX: number;
  dragging: boolean;
  lastX: number;
  moved: number;
};

function coverUrl(p: Project): string {
  const c = p.cover;
  if (c.kind === "mux" && c.playbackId) {
    return `https://image.mux.com/${c.playbackId}/thumbnail.jpg?width=900`;
  }
  if (c.kind === "image" && c.src) return c.src;
  return "";
}

function Row({ dragRef }: { dragRef: React.RefObject<DragState> }) {
  const projects = getFeaturedProjects();
  const textures = useTexture(projects.map(coverUrl));
  const router = useRouter();
  const { size } = useThree();

  const row = useRef<THREE.Group>(null);
  const target = useRef(0);
  const current = useRef(0);
  const velocity = useRef(0);

  const maxX = 0;
  const minX = -(projects.length - 1) * GAP;

  useFrame(() => {
    if (!row.current) return;
    const d = dragRef.current;
    const worldPerPx = (GAP * projects.length) / Math.max(size.width, 1);

    if (d.deltaX !== 0) {
      target.current += d.deltaX * worldPerPx;
      velocity.current = d.deltaX * worldPerPx;
      d.deltaX = 0;
    } else if (!d.dragging) {
      target.current += velocity.current;
      velocity.current *= 0.9;
    }

    target.current = Math.max(minX, Math.min(maxX, target.current));
    current.current = THREE.MathUtils.lerp(current.current, target.current, 0.12);
    row.current.position.x = current.current;

    // Efecto arco: los planos laterales se achican, rotan y se van hacia atrás.
    row.current.children.forEach((child, i) => {
      const worldX = i * GAP + current.current;
      child.rotation.y = -worldX * 0.05;
      const s = 1 - Math.min(Math.abs(worldX) * 0.05, 0.22);
      child.scale.setScalar(s);
      child.position.z = -Math.min(Math.abs(worldX) * 0.25, 1.2);
    });
  });

  return (
    <group ref={row}>
      {projects.map((p, i) => (
        <mesh
          key={p.slug}
          position={[i * GAP, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            if (dragRef.current.moved < 6) router.push(`/work/${p.slug}`);
          }}
        >
          <planeGeometry args={[PLANE_W, PLANE_H]} />
          <meshBasicMaterial map={textures[i]} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function DraggableGallery3DScene() {
  const dragRef = useRef<DragState>({
    deltaX: 0,
    dragging: false,
    lastX: 0,
    moved: 0,
  });

  const onDown = (e: React.PointerEvent) => {
    const d = dragRef.current;
    d.dragging = true;
    d.lastX = e.clientX;
    d.moved = 0;
  };
  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.dragging) return;
    const dx = e.clientX - d.lastX;
    d.lastX = e.clientX;
    d.deltaX += dx;
    d.moved += Math.abs(dx);
  };
  const onUp = () => {
    dragRef.current.dragging = false;
  };

  return (
    <div
      className="h-full w-full"
      style={{ touchAction: "pan-y" }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerCancel={onUp}
    >
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 1.75]}>
        <Suspense fallback={null}>
          <Row dragRef={dragRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
