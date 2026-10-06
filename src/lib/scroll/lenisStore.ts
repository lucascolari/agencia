import type Lenis from "lenis";

/**
 * Referencia compartida a la instancia de Lenis (smooth scroll). El provider la
 * registra; otros componentes pueden frenarla/reanudarla (p. ej. la intro, que
 * debe bloquear el scroll también en desktop, donde Lenis ignora overflow:hidden).
 */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null): void {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}
