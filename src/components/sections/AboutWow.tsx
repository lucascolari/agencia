"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container } from "@/components/ui/Container";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AboutWowScene = dynamic(
  () => import("@/components/3d/AboutWowScene"),
  { ssr: false },
);

/**
 * Momento WOW de About (spec §17): una escena 3D pinneada que la cámara
 * atraviesa con el scroll, mientras entra la tipografía. Si el dispositivo no
 * soporta 3D (o hay reduced-motion / gama baja), cae a una composición
 * tipográfica estática digna — la sección nunca depende de WebGL.
 */
export function AboutWow({
  eyebrow,
  headline,
}: {
  eyebrow: string;
  headline: string;
}) {
  const cap = useDeviceCapability();
  const container = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useGSAP(
    () => {
      if (!cap.allow3D) return;
      const st = ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "+=180%",
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });
      gsap.from(".wow-line", {
        yPercent: 120,
        opacity: 0,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 60%",
        },
      });
      return () => st.kill();
    },
    { scope: container, dependencies: [cap.allow3D] },
  );

  // Fallback estático (sin WebGL / reduced-motion / gama baja / SSR).
  if (cap.ready && !cap.allow3D) {
    return (
      <section className="py-[var(--section-gap)]">
        <Container>
          <p className="text-label uppercase tracking-[0.28em] text-muted">
            {eyebrow}
          </p>
          <h2 className="mt-10 max-w-4xl font-display text-display text-text">
            {headline}
          </h2>
        </Container>
      </section>
    );
  }

  return (
    <section
      ref={container}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        {cap.allow3D && <AboutWowScene progressRef={progress} />}
      </div>
      <Container>
        <p className="text-label uppercase tracking-[0.28em] text-muted">
          {eyebrow}
        </p>
        <h2 className="mt-10 max-w-4xl font-display text-display text-text">
          <span className="block overflow-hidden">
            <span className="wow-line block">{headline}</span>
          </span>
        </h2>
      </Container>
    </section>
  );
}
