"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import {
  subscribeAudioActive,
  subscribeAudioSource,
  toggleAudio,
} from "@/lib/audio/audioReactive";

/**
 * Botón flotante para activar el sonido del reel. Los navegadores no dejan sonar
 * el audio sin un gesto del usuario, así que este es el disparador. Al activarlo,
 * todo el fondo espacial y el reel del hero laten con la música (ver
 * `audioReactive`). Solo aparece donde hay reel (home) y con capacidad de motion.
 */
export function AudioToggle() {
  const cap = useDeviceCapability();
  const [hasSource, setHasSource] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const offSource = subscribeAudioSource(setHasSource);
    const offActive = subscribeAudioActive(setActive);
    return () => {
      offSource();
      offActive();
    };
  }, []);

  // La reactividad de audio mueve escenas 3D: requiere WebGL y respeta
  // reduced-motion. Sin fuente registrada (páginas sin reel) no se muestra.
  if (!cap.ready || !cap.webgl || cap.reducedMotion || !hasSource) return null;

  return (
    <button
      type="button"
      onClick={() => void toggleAudio()}
      aria-pressed={active}
      className={cn(
        "group fixed bottom-6 left-6 z-[var(--z-navigation)] flex items-center gap-3",
        "border border-border bg-background/70 px-4 py-3 backdrop-blur-sm",
        "text-label uppercase tracking-[0.22em] text-text",
        "transition-colors duration-[var(--duration-fast)]",
        "hover:border-accent hover:text-accent",
      )}
    >
      <span aria-hidden className="flex h-4 items-end gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "w-[3px] bg-current",
              active ? "animate-eq" : "h-1.5",
            )}
            style={active ? { animationDelay: `${i * 0.12}s` } : undefined}
          />
        ))}
      </span>
      {active ? "Silenciar" : "Activar sonido"}
    </button>
  );
}
