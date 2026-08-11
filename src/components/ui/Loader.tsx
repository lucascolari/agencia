"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Loader de marca. Fase 2: versión 2D tipográfica que espera solo al primer
 * paint (no a toda la web). El elemento 3D del loader llega en fase 5.
 */
export function Loader({ brand }: { brand: string }) {
  const [done, setDone] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    // Solo en la primera carga de la sesión.
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("loader-seen")) {
        setDone(true);
        return;
      }
      shown.current = true;
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timeout = window.setTimeout(
      () => {
        setDone(true);
        sessionStorage.setItem("loader-seen", "1");
      },
      reduced ? 300 : 1500,
    );
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {!done && shown.current && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[var(--z-loader)] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
        >
          <div className="overflow-hidden">
            <motion.span
              className="block font-display text-4xl font-semibold tracking-[0.12em] text-text md:text-6xl"
              initial={{ y: "120%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {brand}
            </motion.span>
          </div>
          <motion.span
            className="absolute bottom-10 left-1/2 h-px bg-accent"
            initial={{ width: 0, x: "-50%" }}
            animate={{ width: "38%" }}
            transition={{ duration: 1.3, ease: [0.83, 0, 0.17, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
