"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Phase = "checking" | "showing" | "done";

/**
 * Loader de marca. Fase 2: versión 2D tipográfica que espera solo al primer
 * paint (no a toda la web). Se muestra una sola vez por sesión.
 *
 * Máquina de estados con `phase` (sin refs leídos en render): "checking" no
 * pinta nada hasta saber, en cliente, si corresponde mostrarlo.
 */
export function Loader({ brand }: { brand: string }) {
  const [phase, setPhase] = useState<Phase>("checking");
  const reduced = useReducedMotion();

  useEffect(() => {
    // Decisión solo-cliente (sessionStorage) de mostrar el loader una vez.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (sessionStorage.getItem("loader-seen")) {
      setPhase("done");
      return;
    }
    setPhase("showing");
    /* eslint-enable react-hooks/set-state-in-effect */
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timeout = window.setTimeout(
      () => {
        setPhase("done");
        sessionStorage.setItem("loader-seen", "1");
      },
      reduced ? 300 : 1500,
    );
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {phase === "showing" && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[var(--z-loader)] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.7, ease: [0.83, 0, 0.17, 1] }}
        >
          <div className="overflow-hidden">
            <motion.span
              className="block font-display text-4xl font-semibold tracking-[0.12em] text-text md:text-6xl"
              initial={{ y: reduced ? "0%" : "120%" }}
              animate={{ y: "0%" }}
              transition={{ duration: reduced ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {brand}
            </motion.span>
          </div>
          <motion.span
            className="absolute bottom-10 left-1/2 h-px bg-accent"
            initial={{ width: reduced ? "38%" : 0, x: "-50%" }}
            animate={{ width: "38%" }}
            transition={{ duration: reduced ? 0 : 1.3, ease: [0.83, 0, 0.17, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
