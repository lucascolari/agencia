"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Entrada suave al entrar en viewport. Usa IntersectionObserver (Framer Motion
 * whileInView): revela de forma fiable el contenido ya visible al montar y
 * nunca lo deja atrapado invisible. Con reduced-motion no anima.
 *
 * Los reveals simples viven en Framer Motion; GSAP/ScrollTrigger queda para las
 * escenas cinematográficas con pin/scrub (spec §52).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
