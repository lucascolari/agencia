"use client";

import { useEffect, useRef } from "react";
import MuxVideoReact from "@mux/mux-video-react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Video de fondo servido por Mux (streaming adaptativo HLS). Se reproduce solo
 * cuando está en pantalla y se pausa al salir: así una grilla con varios videos
 * no dispara todos los streams a la vez. Con reduced-motion no reproduce y queda
 * el poster (frame estático). Muteado, en loop, sin controles.
 */
export function MuxVideo({
  playbackId,
  poster,
  alt,
  priority,
  className,
}: {
  playbackId: string;
  poster?: string;
  alt: string;
  priority: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // play() devuelve Promise en el navegador y undefined en jsdom.
            el.play()?.catch(() => {
              /* autoplay bloqueado: queda el poster, sin romper nada */
            });
          } else {
            el.pause();
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <MuxVideoReact
      ref={ref}
      playbackId={playbackId}
      poster={poster}
      muted
      loop
      playsInline
      preload={priority ? "auto" : "metadata"}
      aria-label={alt}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
