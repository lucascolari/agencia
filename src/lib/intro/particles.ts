/**
 * Utilidades del sistema de partículas de la intro (Fichas 00–01).
 *
 * La composición es DETERMINISTA: una semilla estable genera siempre la misma
 * escena (lo exige el doc: "La escena no debe reorganizarse aleatoriamente en
 * cada carga"). Todo esto es lógica pura, sin DOM, para poder testearla.
 */

export interface Pt {
  x: number;
  y: number;
}

/** PRNG determinista (mulberry32): misma semilla → misma secuencia. */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Toma `count` puntos de los píxeles "encendidos" (alpha alto) de un ImageData.
 * Devuelve coordenadas en el espacio de píxeles de la imagen. Si hay menos
 * píxeles encendidos que `count`, repite muestras (con leve jitter aplicado por
 * el llamador si lo desea).
 */
export function samplePointsFromAlpha(
  alpha: Uint8ClampedArray | number[],
  width: number,
  height: number,
  count: number,
  rng: () => number,
  threshold = 128,
): Pt[] {
  const lit: number[] = [];
  const total = width * height;
  for (let i = 0; i < total; i++) {
    if (alpha[i] >= threshold) lit.push(i);
  }
  const out: Pt[] = [];
  if (lit.length === 0) return out;
  for (let i = 0; i < count; i++) {
    const idx = lit[(rng() * lit.length) | 0];
    out.push({ x: idx % width, y: (idx / width) | 0 });
  }
  return out;
}

/**
 * Extrae el canal alpha de un ImageData (RGBA) como un array por píxel.
 */
export function alphaChannel(rgba: Uint8ClampedArray, total: number): Uint8ClampedArray {
  const a = new Uint8ClampedArray(total);
  for (let i = 0; i < total; i++) a[i] = rgba[i * 4 + 3];
  return a;
}

/** Interpolación lineal. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Reparte `count` posiciones del campo espacial en profundidad, dejando el
 * CENTRO despejado (el manifiesto vive ahí). Determinista por semilla.
 * `depth` 0 = lejano (chico, tenue), 1 = cercano. Devuelve posiciones
 * normalizadas (-0.5..0.5 del viewport) + su profundidad.
 */
export interface FieldPt extends Pt {
  depth: number;
}

export function buildField(
  count: number,
  rng: () => number,
  clearRadius = 0.16,
): FieldPt[] {
  const out: FieldPt[] = [];
  let guard = 0;
  while (out.length < count && guard < count * 40) {
    guard++;
    const x = rng() - 0.5;
    const y = rng() - 0.5;
    // Deja el centro despejado (elipse: la pantalla es más ancha que alta).
    const d = Math.hypot(x * 1.0, y * 1.7);
    if (d < clearRadius) continue;
    out.push({ x, y, depth: rng() });
  }
  return out;
}
