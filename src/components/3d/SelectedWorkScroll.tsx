"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container } from "@/components/ui/Container";
import { HomeSelectedWork } from "@/components/sections/HomeSelectedWork";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import type { HomeContent } from "@/types/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Scene = dynamic(() => import("./SelectedWorkScrollScene"), { ssr: false });

/**
 * "Trabajos seleccionados" como escena que se recorre con el scroll: las
 * portadas flotan y la cámara vuela a través de ellas al bajar (mismo patrón
 * que el WOW de Nosotros). Sin WebGL / reduced-motion / gama baja cae a la
 * grilla editorial (accesible e indexable).
 */
export function SelectedWorkScroll({
  content,
}: {
  content: HomeContent["selectedWork"];
}) {
  const cap = useDeviceCapability();
  const container = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  // Se habilita en cualquier dispositivo con WebGL (incluido celular). Con
  // reduced-motion o sin WebGL cae a la grilla (accesible e indexable).
  const enabled = cap.webgl && !cap.reducedMotion;

  useGSAP(
    () => {
      if (!enabled) return;
      // Evita saltos por la barra de direcciones del navegador móvil.
      ScrollTrigger.config({ ignoreMobileResize: true });
      const st = ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "+=520%",
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });
      return () => st.kill();
    },
    { scope: container, dependencies: [enabled] },
  );

  if (cap.ready && !enabled) {
    return <HomeSelectedWork content={content} />;
  }

  return (
    <section
      ref={container}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        {enabled && <Scene progressRef={progress} lite={cap.lowEnd} />}
      </div>

      <Container className="pointer-events-none relative">
        <p className="text-label uppercase tracking-[0.28em] text-muted">
          {content.eyebrow}
        </p>
        <h2 className="mt-6 max-w-2xl font-display text-heading text-text">
          {content.title}
        </h2>
      </Container>

      <Container className="pointer-events-none relative mt-auto pb-10">
        <p className="text-label uppercase tracking-[0.24em] text-muted">
          Seguí bajando para recorrer los trabajos
        </p>
      </Container>
    </section>
  );
}
