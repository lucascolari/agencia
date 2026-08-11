"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Entrada suave al entrar en viewport. Usa IntersectionObserver (Framer Motion
 * whileInView): revela de forma fiable el contenido ya visible al montar y
 * nunca lo deja atrapado invisible. Con reduced-motion no anima.
 *
 * `as` permite renderizar como <li> cuando el Reveal es hijo directo de una
 * lista, para no romper la semántica ul > li.
 *
 * Los reveals simples viven en Framer Motion; GSAP/ScrollTrigger queda para las
 * escenas cinematográficas con pin/scrub (spec §52).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li";
}) {
  const reduced = useReducedMotion();
  const MotionTag = as === "li" ? motion.li : motion.div;
  const Static = as === "li" ? "li" : "div";

  if (reduced) {
    return <Static className={cn(className)}>{children}</Static>;
  }

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}
