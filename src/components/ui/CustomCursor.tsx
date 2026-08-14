"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Cursor fluido de desktop: un punto que sigue rápido + un anillo que lo
 * persigue con retardo (estela elástica). Sobre elementos interactivos el anillo
 * crece y se tiñe de acento. No se monta en táctiles ni con reduced-motion.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
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

    const target = { x: -100, y: -100 };
    const dotPos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
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
      dotPos.x += (target.x - dotPos.x) * 0.35;
      dotPos.y += (target.y - dotPos.y) * 0.35;
      ringPos.x += (target.x - ringPos.x) * 0.14;
      ringPos.y += (target.y - ringPos.y) * 0.14;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
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
    <>
      <div
        ref={ring}
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[var(--z-cursor)] rounded-full border mix-blend-difference transition-[width,height,border-color,background-color] duration-300",
          hovering
            ? "h-14 w-14 border-accent bg-accent/10"
            : "h-8 w-8 border-primary/60",
        )}
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[var(--z-cursor)] h-1.5 w-1.5 rounded-full bg-primary mix-blend-difference"
      />
    </>
  );
}
