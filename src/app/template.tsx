"use client";

import { motion, useReducedMotion } from "motion/react";

/** Transición de entrada por navegación. Se refina con continuidad visual en fase 5. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  // Con reduced-motion no animamos: el contenido aparece de una, a opacidad
  // plena (mejor UX y evita medir colores mezclados en tests de accesibilidad).
  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
