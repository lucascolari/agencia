"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

// El bundle de la escena queda fuera del chunk crítico y nunca corre en SSR.
const SpaceScene = dynamic(() => import("./SpaceScene"), { ssr: false });

/**
 * Fondo de espacio persistente de toda la web. Vive en el layout raíz (detrás
 * del contenido) y sobrevive a los cambios de página, así la experiencia
 * espacial es continua. Necesita WebGL; en gama baja o sin WebGL queda el fondo
 * de espacio en CSS (definido en globals.css), sin costo de GPU.
 */
export function SpaceBackground() {
  const cap = useDeviceCapability();
  const reduced = useReducedMotion();

  // El starfield es liviano: se muestra en cualquier dispositivo con WebGL
  // (incluido celular). En gama baja va en modo "lite" (menos estrellas, dpr 1).
  // Sin WebGL queda el fondo de espacio en CSS (globals.css).
  if (!cap.ready || !cap.webgl) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <SpaceScene reduced={Boolean(reduced)} lite={cap.lowEnd} />
    </div>
  );
}
