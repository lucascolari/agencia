"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { HomeSelectedWork } from "@/components/sections/HomeSelectedWork";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import type { HomeContent } from "@/types/content";

const Scene = dynamic(() => import("./DraggableGallery3DScene"), { ssr: false });

/**
 * "Trabajos seleccionados" como galería 3D arrastrable. Si el dispositivo no
 * soporta 3D (o hay reduced-motion / gama baja), cae a la grilla editorial
 * normal — que además es la versión accesible e indexable.
 */
export function SelectedWork3D({
  content,
}: {
  content: HomeContent["selectedWork"];
}) {
  const cap = useDeviceCapability();

  if (!cap.ready || !cap.allow3D) {
    return <HomeSelectedWork content={content} />;
  }

  return (
    <section className="py-[var(--section-gap)]">
      <Container>
        <div className="flex flex-col gap-6 border-t border-border pt-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-label uppercase tracking-[0.28em] text-muted">
              {content.eyebrow}
            </p>
            <h2 className="mt-6 max-w-2xl font-display text-heading text-text">
              {content.title}
            </h2>
          </div>
          <Link
            href="/work"
            className="text-label uppercase tracking-[0.22em] text-muted transition-colors duration-[var(--duration-fast)] hover:text-accent"
          >
            {content.viewAll}
          </Link>
        </div>
      </Container>

      {/* Galería 3D: arrastrá para recorrer, clic para abrir. */}
      <div className="mt-12 h-[62vh] w-full cursor-grab active:cursor-grabbing">
        <Scene />
      </div>

      <Container>
        <p className="mt-6 text-center text-label uppercase tracking-[0.24em] text-muted">
          Arrastrá para explorar — clic para abrir
        </p>
      </Container>
    </section>
  );
}
