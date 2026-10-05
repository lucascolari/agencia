/**
 * Ficha 03 — Desintegración del manifiesto.
 *
 * Orden semántico de desaparición (ligado al progreso de scroll, reversible):
 *   0–18%   ubicación ("Buenos Aires, Argentina.")        → loc
 *   18–38%  última línea ("Desde la primera idea…")        → b2
 *   38–75%  cuerpo central ("En Gular combinamos…")        → b1
 *   75–94%  frase principal ("Cada proyecto…")  queda última → b0
 *   94–100% absorción / estabilización del campo
 *
 * `erosion()` es el grado de desintegración (0 = intacto en su lugar, 1 =
 * absorbido) de una partícula, función pura de: progreso global, la ventana de
 * su bloque y un desfase aleatorio por partícula (para que la erosión sea
 * irregular dentro del bloque, no una cortina). Al ser función pura del
 * progreso, el scroll hacia atrás reconstruye el texto exactamente.
 */

export type BlockKey = "loc" | "b0" | "b1" | "b2";

/** Ventana [inicio, fin] de progreso en la que erosiona cada bloque. */
export const DISINTEGRATION_WINDOWS: Record<BlockKey, [number, number]> = {
  loc: [0.0, 0.18],
  b2: [0.18, 0.38],
  b1: [0.38, 0.75],
  b0: [0.75, 0.94],
};

/** Desfase máximo del arranque por partícula (fracción de la ventana). */
const ONSET = 0.7;
/** Tramo en el que una partícula pasa de intacta (0) a absorbida (1). */
const SPAN = 0.3;

export function erosion(
  progress: number,
  window: [number, number],
  rand: number,
): number {
  const [a, b] = window;
  if (progress <= a) return 0;
  if (progress >= b) return 1;
  const local = (progress - a) / (b - a);
  const e = (local - rand * ONSET) / SPAN;
  if (e <= 0) return 0;
  if (e >= 1) return 1;
  return e;
}
