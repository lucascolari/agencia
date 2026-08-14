"use client";

import { useRef, type ReactNode } from "react";

/**
 * Efecto magnético: mientras el puntero está sobre el elemento, este se corre
 * hacia el cursor y vuelve a su lugar al salir. Solo en desktop (pointer fino)
 * y sin reduced-motion; en el resto queda quieto.
 */
export function Magnetic({
  children,
  strength = 0.35,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
    >
      {children}
    </span>
  );
}
