"use client";

import { useMemo } from "react";
import {
  manifestoAccessible,
  manifestoLocation,
  manifestoParagraphs,
} from "@/lib/content/manifesto";

/**
 * Manifiesto de la primera pantalla (Ficha 02).
 *
 * - Capa accesible: el texto completo existe una sola vez para lectores de
 *   pantalla (no se anuncia carácter por carácter).
 * - Capa visual: cada carácter aparece con opacidad + 1px de desplazamiento,
 *   escalonado con `transition-delay` (sin cursor, sin sonido, sin rebote). El
 *   escalonado es puro CSS: cero trabajo por frame.
 *
 * `reveal` dispara la escritura; `animate=false` (reduced-motion o visita
 * posterior) muestra el texto completo de una, sin animación.
 *
 * NOTA: la ubicación usa una serif temporal (Georgia) hasta que llegue la
 * tipografía oficial del diseñador; el cuerpo usa la sans del sitio.
 */

const BASE = 22; // ms por carácter
const PUNCT: Record<string, number> = {
  ",": 60,
  ":": 100,
  ".": 150,
};
const AFTER_LOCATION = 300;
const BLOCK_GAP = 200;

interface Char {
  ch: string;
  delay: number;
}
interface Block {
  text: string;
  chars: Char[];
}

function buildTimeline(): { location: Block; body: Block[]; total: number } {
  let t = 0;
  const mkBlock = (text: string, gapBefore: number): Block => {
    t += gapBefore;
    const chars: Char[] = [];
    for (const ch of text) {
      chars.push({ ch, delay: t });
      t += BASE + (PUNCT[ch] ?? 0);
    }
    return { text, chars };
  };
  const location = mkBlock(manifestoLocation, 0);
  const body = manifestoParagraphs.map((p, i) =>
    mkBlock(p, i === 0 ? AFTER_LOCATION : BLOCK_GAP),
  );
  return { location, body, total: t };
}

function CharSpan({
  ch,
  delay,
  reveal,
  animate,
}: {
  ch: string;
  delay: number;
  reveal: boolean;
  animate: boolean;
}) {
  const visible = reveal || !animate;
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        whiteSpace: "pre",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(1px)",
        // Delay dentro del shorthand (no mezclar shorthand + longhand: React avisa).
        transition: animate
          ? `opacity 80ms linear ${delay}ms, transform 80ms linear ${delay}ms`
          : "none",
      }}
    >
      {ch}
    </span>
  );
}

/**
 * Renderiza los caracteres agrupados en palabras. Cada palabra es un
 * inline-block con `white-space: nowrap`, de modo que solo se puede cortar
 * renglón ENTRE palabras y nunca en medio de una (bug en móvil). Los espacios
 * son el único punto de corte y no se animan (son invisibles).
 */
function renderChars(
  chars: Char[],
  keyPrefix: string,
  reveal: boolean,
  animate: boolean,
) {
  const nodes: React.ReactNode[] = [];
  let word: Char[] = [];
  let wordStart = 0;
  const flush = () => {
    if (word.length === 0) return;
    const w = word;
    nodes.push(
      <span
        key={`${keyPrefix}-w${wordStart}`}
        style={{ display: "inline-block", whiteSpace: "nowrap" }}
      >
        {w.map((c, i) => (
          <CharSpan
            key={`${keyPrefix}-${wordStart + i}`}
            ch={c.ch}
            delay={c.delay}
            reveal={reveal}
            animate={animate}
          />
        ))}
      </span>,
    );
    word = [];
  };
  chars.forEach((c, i) => {
    if (c.ch === " ") {
      flush();
      // Espacio = oportunidad de corte de renglón (texto normal, no inline-block).
      nodes.push(<span key={`${keyPrefix}-s${i}`}> </span>);
    } else {
      if (word.length === 0) wordStart = i;
      word.push(c);
    }
  });
  flush();
  return nodes;
}

export function Manifesto({
  reveal,
  animate,
}: {
  reveal: boolean;
  animate: boolean;
}) {
  const tl = useMemo(() => buildTimeline(), []);

  return (
    <div className="mx-auto w-[88%] max-w-2xl text-center md:w-full">
      {/* Capa accesible: una sola lectura completa. */}
      <p className="sr-only">{manifestoAccessible}</p>

      {/* Capa visual (decorativa para tecnologías asistivas). */}
      <p
        aria-hidden
        data-mblock="loc"
        className="text-lg tracking-wide text-text md:text-xl"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {renderChars(tl.location.chars, "loc", reveal, animate)}
      </p>

      <div
        aria-hidden
        className="mt-10 space-y-6 text-balance font-body text-xl leading-relaxed text-text md:text-2xl"
      >
        {tl.body.map((block, bi) => (
          <p key={`b-${bi}`} data-mblock={`b${bi}`}>
            {renderChars(block.chars, `b-${bi}`, reveal, animate)}
          </p>
        ))}
      </div>
    </div>
  );
}

/** Duración total estimada de la escritura (ms), para coordinar el desbloqueo. */
export function manifestoTypingDuration(): number {
  return buildTimeline().total;
}
