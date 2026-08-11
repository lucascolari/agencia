"use client";

import dynamic from "next/dynamic";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

// El bundle de Three.js/R3F queda fuera del chunk crítico y nunca corre en SSR.
const HeroObjectScene = dynamic(() => import("./HeroObjectScene"), {
  ssr: false,
});

/**
 * Puente entre el hero y la escena 3D. Solo monta WebGL si el dispositivo lo
 * permite (WebGL + sin reduced-motion + no gama baja). En cualquier otro caso
 * no renderiza nada y el fondo con gradiente del hero queda como fallback digno.
 */
export function Hero3D() {
  const cap = useDeviceCapability();

  if (!cap.ready || !cap.allow3D) return null;

  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <HeroObjectScene />
    </div>
  );
}
