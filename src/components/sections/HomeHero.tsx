"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Container } from "@/components/ui/Container";
import { useLocalTime } from "@/hooks/useLocalTime";
import type { HomeContent } from "@/types/content";

gsap.registerPlugin(useGSAP);

export function HomeHero({
  content,
  location,
}: {
  content: HomeContent["hero"];
  location: string;
}) {
  const time = useLocalTime();
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set("[data-hero-line], [data-hero-fade]", { autoAlpha: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.15,
      });
      tl.from("[data-hero-line]", {
        yPercent: 120,
        duration: 1.1,
        stagger: 0.12,
      })
        .from(
          "[data-hero-fade]",
          { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.1 },
          "-=0.6",
        );
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pb-10 pt-32"
    >
      {/* Placeholder del video de fondo (fase 6: Mux). Gradiente editorial sobrio. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 70% 0%, #1b1b1a 0%, var(--background) 60%)",
        }}
      />

      <Container className="flex items-center justify-between text-label uppercase tracking-[0.24em] text-muted">
        <span data-hero-fade>{location}</span>
        <span data-hero-fade className="tabular-nums">
          {content.timeLabel} {time ?? "--:--:--"}
        </span>
      </Container>

      <Container>
        <p
          data-hero-fade
          className="text-label uppercase tracking-[0.28em] text-muted"
        >
          {content.eyebrow}
        </p>
        <h1 className="mt-8 font-display text-display text-text">
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              {content.title}
            </span>
          </span>
        </h1>
        <p
          data-hero-fade
          className="mt-10 max-w-xl text-lg leading-relaxed text-secondary"
        >
          {content.lead}
        </p>
      </Container>

      <Container>
        <span
          data-hero-fade
          className="inline-flex items-center gap-3 text-label uppercase tracking-[0.24em] text-muted"
        >
          <span className="h-8 w-px animate-pulse bg-border" />
          {content.scrollHint}
        </span>
      </Container>
    </section>
  );
}
