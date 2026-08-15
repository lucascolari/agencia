"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { getNext, getPrev, isInJourney, type JourneyStop } from "@/config/journey";
import {
  addIntent,
  decayIntent,
  intentConfirmed,
  intentProgress,
} from "@/lib/motion/intent";
import { getScrollSignals, triggerWarp } from "@/lib/motion/scrollSignals";

type Dir = "next" | "prev";

const RING_R = 12;
const RING_C = 2 * Math.PI * RING_R;
const SWIPE_MIN = 60; // px de swipe para confirmar en mobile

function isEditableTarget(el: EventTarget | null): boolean {
  const node = el as HTMLElement | null;
  if (!node) return false;
  const tag = node.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    tag === "BUTTON" ||
    tag === "A" ||
    node.isContentEditable
  );
}

function atBottom(): boolean {
  const doc = document.documentElement;
  return window.scrollY + window.innerHeight >= doc.scrollHeight - 2;
}
function atTop(): boolean {
  return window.scrollY <= 2;
}

/**
 * Controlador de avance: convierte los bordes de cada página en un "viaje"
 * fluido por el recorrido del sitio (orden del menú). En el borde, una intención
 * clara —empujar la rueda (C3), flecha/espacio (C1) o swipe (C2)— dispara el
 * salto espacial (warp) hacia la página siguiente/anterior.
 *
 * No secuestra el scroll intermedio: solo actúa exactamente en los bordes, y
 * respeta reduced-motion (navega con la transición suave, sin warp).
 */
export function AdvanceController() {
  const pathname = usePathname();
  const router = useTransitionRouter();

  const affordRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  // Estado mutable que comparten el loop y los handlers (sin re-render).
  const st = useRef({ intent: 0, dir: null as Dir | null, navigating: false });

  useEffect(() => {
    // En páginas fuera del recorrido (legales), nada de avance automático.
    if (!isInJourney(pathname)) return;

    // Reinicia al cambiar de página (el layout persiste entre rutas).
    st.current.intent = 0;
    st.current.dir = null;
    st.current.navigating = false;

    const nextStop = getNext(pathname);
    const prevStop = getPrev(pathname);
    const reducedNow = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const go = (dir: Dir) => {
      if (st.current.navigating) return;
      const stop: JourneyStop | null = dir === "next" ? nextStop : prevStop;
      if (!stop) return;
      st.current.navigating = true;
      st.current.intent = 0;
      if (reducedNow) {
        router.push(stop.href);
        return;
      }
      triggerWarp();
      // El flash del warp cubre el cambio; navegamos apenas arranca.
      window.setTimeout(() => router.push(stop.href), 180);
    };

    const onWheel = (e: WheelEvent) => {
      if (st.current.navigating) return;
      const dir = st.current.dir;
      if (dir === "next" && e.deltaY > 0) {
        st.current.intent = addIntent(st.current.intent, e.deltaY);
      } else if (dir === "prev" && e.deltaY < 0) {
        st.current.intent = addIntent(st.current.intent, -e.deltaY);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (st.current.navigating) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isEditableTarget(e.target)) return;
      const key = e.key;
      if ((key === "ArrowDown" || key === " " || key === "Spacebar") &&
          nextStop && atBottom()) {
        e.preventDefault();
        go("next");
      } else if (key === "ArrowUp" && prevStop && atTop()) {
        e.preventDefault();
        go("prev");
      }
    };

    let touchY = 0;
    let touchStartBottom = false;
    let touchStartTop = false;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
      touchStartBottom = atBottom();
      touchStartTop = atTop();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (st.current.navigating) return;
      const endY = e.changedTouches[0]?.clientY ?? touchY;
      const dy = endY - touchY;
      if (touchStartBottom && dy < -SWIPE_MIN && nextStop) go("next");
      else if (touchStartTop && dy > SWIPE_MIN && prevStop) go("prev");
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = now - last;
      last = now;

      // Dirección activa según el borde en el que estás.
      let dir: Dir | null = null;
      if (atBottom() && nextStop) dir = "next";
      else if (atTop() && prevStop) dir = "prev";
      if (dir !== st.current.dir) {
        st.current.dir = dir;
        st.current.intent = 0;
      }
      st.current.intent = decayIntent(st.current.intent, dt);

      const progress = intentProgress(st.current.intent);
      if (
        dir &&
        !st.current.navigating &&
        intentConfirmed(st.current.intent)
      ) {
        go(dir);
      }

      // Indicador "Siguiente →" (oculto si no hay borde activo o si navegamos).
      const afford = affordRef.current;
      if (afford) {
        if (dir && !st.current.navigating) {
          afford.style.opacity = String(0.4 + progress * 0.6);
          const stop = dir === "next" ? nextStop : prevStop;
          const label = labelRef.current;
          if (label && stop) {
            label.textContent =
              dir === "next" ? `Seguí a ${stop.label}` : `Volver a ${stop.label}`;
          }
          if (arcRef.current) {
            arcRef.current.style.strokeDashoffset = String(
              RING_C * (1 - progress),
            );
          }
        } else {
          afford.style.opacity = "0";
        }
      }

      // Flash del salto espacial (A1).
      if (flashRef.current) {
        const w = getScrollSignals().warp;
        flashRef.current.style.opacity = String(Math.min(w * 1.1, 1) * 0.92);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [pathname, router]);

  return (
    <>
      {/* Flash del salto espacial entre páginas (A1). */}
      <div
        ref={flashRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[var(--z-overlay)]"
        style={{
          opacity: 0,
          background:
            "radial-gradient(120% 120% at 50% 50%, rgba(228,255,63,0.10) 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.98) 100%)",
        }}
      />
      {/* Indicador de avance. Decorativo (la navegación real vive en el header). */}
      <div
        ref={affordRef}
        aria-hidden
        className="pointer-events-none fixed bottom-8 left-1/2 z-[var(--z-navigation)] -translate-x-1/2"
        style={{ opacity: 0, transition: "opacity 120ms linear" }}
      >
        <div className="flex items-center gap-3 border border-border bg-background/80 px-4 py-2.5 backdrop-blur-sm">
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
            <circle
              cx="14"
              cy="14"
              r={RING_R}
              fill="none"
              stroke="var(--border)"
              strokeWidth="2"
            />
            <circle
              ref={arcRef}
              cx="14"
              cy="14"
              r={RING_R}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              transform="rotate(-90 14 14)"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C}
            />
          </svg>
          <span
            ref={labelRef}
            className="text-label uppercase tracking-[0.22em] text-text"
          />
        </div>
      </div>
    </>
  );
}
