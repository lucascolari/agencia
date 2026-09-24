/**
 * Estado compartido de la intro. Coordina el lienzo de partículas (ceremonia),
 * la escritura del manifiesto y el bloqueo de scroll sin pasar props entre
 * componentes lejanos. Mismo patrón pub/sub que el resto de las señales.
 */

export type IntroPhase =
  | "pending" // aún no se decidió (SSR / primer frame en cliente)
  | "ceremony" // corre la animación de la "g" y los textos
  | "manifesto" // se escribe el manifiesto
  | "done"; // pantalla estable, scroll habilitado

const SESSION_KEY = "gular-intro-seen";

let phase: IntroPhase = "pending";
const listeners = new Set<(p: IntroPhase) => void>();

export function getIntroPhase(): IntroPhase {
  return phase;
}

export function setIntroPhase(p: IntroPhase): void {
  if (p === phase) return;
  phase = p;
  for (const fn of listeners) fn(p);
}

export function subscribeIntro(fn: (p: IntroPhase) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** ¿Ya se reprodujo la intro en esta sesión? (una sola vez por sesión). */
export function introSeenThisSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* modo privado / storage bloqueado: la intro se reproduce igual */
  }
}
