/**
 * Contenido textual de la primera pantalla (Fichas 00–02 del diseñador).
 * El texto es definitivo y no debe reformularse.
 */

/** Estados tipográficos de la intro (Ficha 00). */
export const introText = {
  // "No hay solución" — conserva el contraste entre las dos partes.
  frase: "No hay solución",
  // Resolución conceptual.
  singular: "SINGULAR",
} as const;

/** Ubicación (serif) — se escribe primero (Ficha 02). */
export const manifestoLocation = "Buenos Aires, Argentina.";

/**
 * Cuerpo del manifiesto (sans serif), en el orden exacto de escritura. Cada
 * entrada es un bloque; se escriben como una única secuencia continua.
 */
export const manifestoParagraphs = [
  "Cada proyecto tiene una solución singular.",
  "En Gular combinamos sensibilidad artística, estrategia comercial y tecnología para encontrarla. Desarrollamos el universo de cada marca: cómo se define, cómo se expresa y cómo se conecta con las personas.",
  "Desde la primera idea hasta su identidad, su comunicación y sus experiencias digitales.",
] as const;

/** Texto plano completo (para la capa accesible, leída de una sola vez). */
export const manifestoAccessible = [
  manifestoLocation,
  ...manifestoParagraphs,
].join("\n\n");
