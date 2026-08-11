"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Cursor custom de desktop. Un punto que sigue al puntero con leve retardo y se
 * agranda sobre elementos interactivos. No se monta en dispositivos táctiles ni
 * con reduced-motion; en esos casos queda el cursor nativo del sistema.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!finePointer || reduced) return;
    // Detección solo-cliente del tipo de puntero: no corre en SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);

    // Arranca fuera de pantalla: no mostramos el punto hasta el primer movimiento.
    const pos = { x: -100, y: -100 };
    const target = { ...pos };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const interactive = (e.target as HTMLElement)?.closest(
        "a, button, [role='button'], input, textarea, label",
      );
      setHovering(Boolean(interactive));
    };

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);
    document.documentElement.style.cursor = "none";

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.style.cursor = "";
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      aria-hidden
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[var(--z-cursor)] rounded-full mix-blend-difference transition-[width,height] duration-[var(--duration-fast)]",
        hovering ? "h-12 w-12 bg-accent" : "h-3 w-3 bg-primary",
      )}
    />
  );
}
