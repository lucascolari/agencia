"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.83, 0, 0.17, 1] as const;

/**
 * Transición entre páginas: un panel del color del espacio cubre y se retira
 * con un barrido, revelando la nueva página que sube suavemente. Da continuidad
 * "una sola experiencia" al navegar. Con reduced-motion no anima.
 *
 * El template se re-monta en cada navegación, así que el barrido se dispara solo
 * en cada cambio de página.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <>
      {/* Panel de barrido: cubre y se retira hacia arriba revelando el contenido. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[var(--z-overlay)] origin-top"
        style={{ background: "var(--space)" }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        {children}
      </motion.div>
    </>
  );
}
