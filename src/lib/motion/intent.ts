/**
 * Acumulador de "intención" para el avance con la rueda (C3): en el borde de la
 * página, el primer scroll NO navega; hay que empujar de forma sostenida hasta
 * llenar un umbral. Así se evita cambiar de página por accidente.
 *
 * Funciones puras (fáciles de testear); el controlador las orquesta en su loop.
 */

/** Empuje acumulado (px) necesario para confirmar el avance. */
export const INTENT_THRESHOLD = 220;

/** Tope de acumulación, para que soltar y volver a empujar responda rápido. */
const INTENT_CAP = INTENT_THRESHOLD * 1.2;

/** Suma empuje en la dirección del borde. Ignora empuje contrario (delta < 0). */
export function addIntent(current: number, delta: number): number {
  const next = current + Math.max(0, delta);
  return Math.min(next, INTENT_CAP);
}

/** Decae la intención con el tiempo: si el visitante frena, se desinfla. */
export function decayIntent(
  current: number,
  dtMs: number,
  ratePerSec = 2.5,
): number {
  const decayed = current - current * ratePerSec * (dtMs / 1000);
  return decayed < 0 ? 0 : decayed;
}

/** Progreso 0..1 para pintar el arco del indicador. */
export function intentProgress(current: number): number {
  return Math.min(current / INTENT_THRESHOLD, 1);
}

/** ¿Se alcanzó el umbral para navegar? */
export function intentConfirmed(current: number): boolean {
  return current >= INTENT_THRESHOLD;
}
