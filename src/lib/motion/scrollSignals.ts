/**
 * Señal de warp compartida (singleton de módulo), en el mismo espíritu que
 * `audioReactive`: un valor que la escena espacial lee cada frame SIN provocar
 * renders de React.
 *
 * - `warp` (0..1): salto a velocidad-luz entre páginas (A1). El controlador de
 *   avance lo dispara; la escena espacial atraviesa el campo de estrellas y un
 *   flash cubre el cambio de página.
 */

type Signals = { warp: number };

const signals: Signals = { warp: 0 };

let warpTarget = 0;
const warpListeners = new Set<(warping: boolean) => void>();

export function getScrollSignals(): Signals {
  return signals;
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
