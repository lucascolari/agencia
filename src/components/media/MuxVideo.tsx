"use client";

import MuxVideoReact from "@mux/mux-video-react";
import { cn } from "@/lib/utils";

/**
 * Video de fondo servido por Mux (streaming adaptativo HLS). Se comporta como un
 * <video> nativo: autoplay muteado, en loop, sin controles. Client Component
 * porque Mux resuelve el HLS en el navegador.
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
  return (
    <MuxVideoReact
      playbackId={playbackId}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload={priority ? "auto" : "metadata"}
      aria-label={alt}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
