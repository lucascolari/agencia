/**
 * Recorrido del sitio como un anillo, en orden del menú:
 *   Inicio → Trabajos → Nosotros → Contacto → (vuelve a Inicio)
 *
 * El "controlador de avance" usa esto para saber a qué página llevar cuando el
 * visitante llega a un borde y confirma la intención de avanzar/retroceder.
 *
 * Reglas:
 * - Las páginas legales (/cookies, /privacidad, /terminos) NO están en el
 *   recorrido: ahí el avance automático queda desactivado.
 * - Un caso de estudio (/work/[slug]) toma el lugar de /work: su "siguiente" es
 *   la página que sigue a Trabajos (Nosotros) y su "anterior" es Trabajos.
 */

export interface JourneyStop {
  href: string;
  label: string;
}

/** Orden canónico del recorrido (coincide con el menú). */
export const JOURNEY: JourneyStop[] = [
  { href: "/", label: "Inicio" },
  { href: "/work", label: "Trabajos" },
  { href: "/about", label: "Nosotros" },
  { href: "/contact", label: "Contacto" },
];

const WORK = JOURNEY.find((s) => s.href === "/work")!;

function normalize(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function isCaseStudy(path: string): boolean {
  return path.startsWith("/work/");
}

/** Índice del anillo para el pathname (los casos toman el slot de /work), o -1. */
function indexOf(pathname: string): number {
  const path = normalize(pathname);
  const effective = isCaseStudy(path) ? "/work" : path;
  return JOURNEY.findIndex((s) => s.href === effective);
}

/**
 * Página siguiente en el anillo (Contacto vuelve a Inicio). Un caso de estudio
 * avanza a lo que sigue de Trabajos (Nosotros). null si está fuera del recorrido.
 */
export function getNext(pathname: string): JourneyStop | null {
  const i = indexOf(pathname);
  if (i === -1) return null;
  return JOURNEY[(i + 1) % JOURNEY.length];
}

/**
 * Página anterior en el anillo (Inicio va a Contacto). Desde un caso de estudio,
 * "anterior" vuelve a la lista de Trabajos. null si está fuera del recorrido.
 */
export function getPrev(pathname: string): JourneyStop | null {
  if (isCaseStudy(normalize(pathname))) return WORK;
  const i = indexOf(pathname);
  if (i === -1) return null;
  return JOURNEY[(i - 1 + JOURNEY.length) % JOURNEY.length];
}

/** ¿El pathname participa del recorrido con avance automático? */
export function isInJourney(pathname: string): boolean {
  return indexOf(pathname) !== -1;
}
