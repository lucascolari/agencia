"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Hero3D } from "@/components/3d/Hero3D";
import { HeroVideoShader } from "@/components/3d/HeroVideoShader";
import { useLocalTime } from "@/hooks/useLocalTime";
import type { HomeContent } from "@/types/content";

const EASE = [0.16, 1, 0.3, 1] as const;

export function HomeHero({
  content,
  location,
}: {
  content: HomeContent["hero"];
  location: string;
}) {
  const time = useLocalTime();
  const reduced = useReducedMotion();

  const fade: Variants = {
    hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 16 },
    show: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: reduced
        ? { duration: 0 }
        : { duration: 0.8, ease: EASE, delay: 0.2 + i * 0.1 },
    }),
  };

  const hasVideo = Boolean(content.video);

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pb-10 pt-32">
      {hasVideo ? (
        <>
          {/* Video de fondo fullscreen: reel de Mux en shader WebGL (con fallback). */}
          <div aria-hidden className="absolute inset-0 -z-20">
            <HeroVideoShader media={content.video!} />
          </div>
          {/* Overlay para legibilidad del texto sobre el video. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(180deg, rgba(12,12,11,0.55) 0%, rgba(12,12,11,0.25) 40%, rgba(12,12,11,0.75) 100%)",
            }}
          />
        </>
      ) : (
        <>
          {/* Gradiente editorial sobrio como fondo alternativo. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-20"
            style={{
              background:
                "radial-gradient(120% 80% at 70% 0%, #1b1b1a 0%, var(--background) 60%)",
            }}
          />
          {/* Objeto de marca 3D (solo si el dispositivo lo permite; fallback = gradiente). */}
          <Hero3D />
        </>
      )}

      <Container className="flex items-center justify-between text-label uppercase tracking-[0.24em] text-muted">
        <motion.span variants={fade} custom={0} initial="hidden" animate="show">
          {location}
        </motion.span>
        <motion.span
          variants={fade}
          custom={1}
          initial="hidden"
          animate="show"
          className="tabular-nums"
        >
          {content.timeLabel} {time ?? "--:--:--"}
        </motion.span>
      </Container>

      <Container>
        <motion.p
          variants={fade}
          custom={1}
          initial="hidden"
          animate="show"
          className="text-label uppercase tracking-[0.28em] text-muted"
        >
          {content.eyebrow}
        </motion.p>
        <h1 className="mt-8 font-display text-display text-text">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: reduced ? 0 : "120%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
            >
              {content.title}
            </motion.span>
          </span>
        </h1>
        <motion.p
          variants={fade}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-10 max-w-xl text-lg leading-relaxed text-secondary"
        >
          {content.lead}
        </motion.p>
      </Container>

      <Container>
        <motion.span
          variants={fade}
          custom={4}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-3 text-label uppercase tracking-[0.24em] text-muted"
        >
          <span className="h-8 w-px animate-pulse bg-border" />
          {content.scrollHint}
        </motion.span>
      </Container>
    </section>
  );
}
