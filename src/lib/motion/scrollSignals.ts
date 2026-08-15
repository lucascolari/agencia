/**
 * Señales de movimiento compartidas (singleton de módulo), en el mismo espíritu
 * que `audioReactive`: valores que las escenas 3D y los overlays leen cada frame
 * SIN provocar renders de React.
 *
 * - `velocity` (0..1): qué tan rápido se está scrolleando ahora. Lo alimenta el
 *   provider de scroll (Lenis). Hace que el mundo reaccione a la velocidad (B3):
 *   las estrellas se estiran y el contenido tiene un leve motion-blur.
 * - `warp` (0..1): salto a velocidad-luz entre páginas (A1). El controlador de
 *   avance lo dispara; la escena espacial atraviesa el campo de estrellas y un
 *   flash cubre el cambio de página.
 */

type Signals = { velocity: number; warp: number };

const signals: Signals = { velocity: 0, warp: 0 };

// Velocidad cruda máxima esperada (px/frame aprox.) para normalizar a 0..1.
const MAX_VELOCITY = 60;

let warpTarget = 0;
const warpListeners = new Set<(warping: boolean) => void>();

export function getScrollSignals(): Signals {
  return signals;
}

/**
 * Reporta la velocidad instantánea de scroll (px/frame). Se normaliza y se
 * suaviza para que las escenas la consuman sin saltos.
 */
export function reportScrollVelocity(pxPerFrame: number): void {
  const v = Math.min(Math.abs(pxPerFrame) / MAX_VELOCITY, 1);
  // Sube rápido, baja suave: se siente la aceleración y el frenado es elegante.
  const k = v > signals.velocity ? 0.4 : 0.08;
  signals.velocity += (v - signals.velocity) * k;
}

/** Avanza la interpolación del warp hacia su objetivo. Llamar cada frame. */
export function stepWarp(): void {
  const k = warpTarget > signals.warp ? 0.22 : 0.06;
  signals.warp += (warpTarget - signals.warp) * k;
  if (warpTarget === 0 && signals.warp < 0.001) signals.warp = 0;
}

/** Pico de warp: sube a 1 y, pasado `holdMs`, vuelve a 0. */
export function triggerWarp(holdMs = 520): void {
  warpTarget = 1;
  emitWarp(true);
  window.setTimeout(() => {
    warpTarget = 0;
    emitWarp(false);
  }, holdMs);
}

export function isWarping(): boolean {
  return warpTarget === 1;
}

export function subscribeWarp(fn: (warping: boolean) => void): () => void {
  warpListeners.add(fn);
  return () => {
    warpListeners.delete(fn);
  };
}

function emitWarp(warping: boolean) {
  for (const fn of warpListeners) fn(warping);
}
