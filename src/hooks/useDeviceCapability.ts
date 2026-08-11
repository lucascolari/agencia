"use client";

import { useEffect, useState } from "react";

export interface DeviceCapability {
  /** true cuando ya se evaluó en cliente (evita hydration mismatch). */
  ready: boolean;
  webgl: boolean;
  reducedMotion: boolean;
  lowEnd: boolean;
  /** Conveniencia: se puede correr la experiencia 3D completa. */
  allow3D: boolean;
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

function detectLowEnd(): boolean {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };
  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  // Heurística conservadora: poca RAM o pocos núcleos en un dispositivo táctil.
  return memory <= 4 || (cores <= 4 && coarse);
}

/**
 * Evalúa una sola vez en cliente si el dispositivo puede correr 3D. Server y
 * primer render devuelven `allow3D: false` para no bloquear el contenido ni
 * romper la hidratación; el 3D se activa después si corresponde.
 */
export function useDeviceCapability(): DeviceCapability {
  const [cap, setCap] = useState<DeviceCapability>({
    ready: false,
    webgl: false,
    reducedMotion: false,
    lowEnd: false,
    allow3D: false,
  });

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const webgl = detectWebGL();
    const lowEnd = detectLowEnd();
    setCap({
      ready: true,
      webgl,
      reducedMotion,
      lowEnd,
      allow3D: webgl && !reducedMotion && !lowEnd,
    });
  }, []);

  return cap;
}
