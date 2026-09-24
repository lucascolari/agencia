"use client";

import { useEffect, useRef, useState } from "react";
import {
  alphaChannel,
  buildField,
  lerp,
  makeRng,
  samplePointsFromAlpha,
  type FieldPt,
  type Pt,
} from "@/lib/intro/particles";
import {
  markIntroSeen,
  introSeenThisSession,
  setIntroPhase,
  type IntroPhase,
} from "@/lib/intro/introState";
import { introText } from "@/lib/content/manifesto";
import { Manifesto, manifestoTypingDuration } from "./Manifesto";

/**
 * Primera pantalla de Gular (Fichas 00–02 del diseñador), reconstruida con SVG +
 * partículas en un canvas 2D (opción permitida por el doc). Secuencia:
 *
 *   negro → la "g" se forma de materia en movimiento → "No hay solución" →
 *   "SINGULAR" → vuelve a la "g" → se fragmenta en el campo espacial →
 *   se escribe el manifiesto.
 *
 * Silenciosa, sin botón de saltar, scroll bloqueado hasta terminar, una sola vez
 * por sesión. Con reduced-motion o en visitas posteriores entra directo al
 * estado estable.
 *
 * PLACEHOLDERS (hasta que lleguen los assets del diseñador): la "g" usa el
 * isologo real como silueta; los textos y el manifiesto usan fuentes temporales;
 * la temporización sigue el mapa del doc pero debe contrastarse con gularintro.mp4.
 */

// Línea temporal (ms), según el mapa de la Ficha 00.
// Fases intermedias (forma la "g" ~0,5–2 s, vuelve a la "g" ~10,5–13,5 s) quedan
// implícitas en los tramos de `targetFor`; acá solo los límites que se leen.
const FADE_IN = 350;
const HOLD_END = 4500;
const T1_END = 7800; // "No hay solución"
const T2_END = 10500; // "SINGULAR"
const INTRO_END = 14000; // "g" final → empieza la fragmentación
const MANIFESTO_START = INTRO_END + 400; // la escritura arranca a los 0,4 s

const SEED = 20240924;
const LERP_K = 0.07;

type Mode = "ceremony" | "ambient" | "frozen";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function GularIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<IntroPhase>("pending");
  const [animate, setAnimate] = useState(true);

  // Refleja la fase en <html data-intro> y en el estado global (para el header).
  useEffect(() => {
    document.documentElement.dataset.intro = phase;
    setIntroPhase(phase);
    return () => {
      delete document.documentElement.dataset.intro;
    };
  }, [phase]);

  // Bloqueo de scroll durante la ceremonia/escritura (Fichas 00–02).
  useEffect(() => {
    const locked = animate && phase !== "done" && phase !== "pending";
    if (!locked) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const blockKeys = new Set([
      " ",
      "Spacebar",
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
    ]);
    const prevent = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      if (blockKeys.has(e.key)) e.preventDefault();
    };
    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
      window.removeEventListener("keydown", onKey);
    };
  }, [animate, phase]);

  // Motor de partículas.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const seen = introSeenThisSession();
    const mode: Mode = reduced ? "frozen" : seen ? "ambient" : "ceremony";

    const mobile =
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768;
    const P = mobile ? 720 : 1400;

    let cssW = window.innerWidth;
    let cssH = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, mobile ? 2 : 2);

    // Composición determinista.
    const rng = makeRng(SEED);
    const fieldNorm: FieldPt[] = buildField(P, rng);
    const phases = new Float32Array(P);
    for (let i = 0; i < P; i++) phases[i] = rng() * Math.PI * 2;

    // Buffers de posición.
    const cx = new Float32Array(P);
    const cy = new Float32Array(P);
    let gPts: Pt[] = [];
    let t1Pts: Pt[] = [];
    let t2Pts: Pt[] = [];
    const fldX = new Float32Array(P);
    const fldY = new Float32Array(P);

    let isoImg: HTMLImageElement | null = null;
    let raf = 0;
    let start = 0;
    let fieldMix = 0;
    const pointer = { x: 0, y: 0 };

    const sizeCanvas = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 2 : 2);
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Muestra puntos de una silueta dibujada en un canvas offscreen.
    const sampleDraw = (
      w: number,
      h: number,
      draw: (c: CanvasRenderingContext2D, w: number, h: number) => void,
    ): Pt[] => {
      const off = document.createElement("canvas");
      off.width = Math.max(1, Math.ceil(w));
      off.height = Math.max(1, Math.ceil(h));
      const octx = off.getContext("2d");
      if (!octx) return [];
      draw(octx, off.width, off.height);
      const data = octx.getImageData(0, 0, off.width, off.height).data;
      const alpha = alphaChannel(data, off.width * off.height);
      const pts = samplePointsFromAlpha(alpha, off.width, off.height, P, rng);
      const centerX = cssW / 2;
      const centerY = cssH / 2;
      return pts.map((p) => ({
        x: centerX + (p.x - off.width / 2),
        y: centerY + (p.y - off.height / 2),
      }));
    };

    const shapeFromImage = (img: HTMLImageElement): Pt[] => {
      const h = Math.min(cssH * 0.42, 340);
      const w = h * (img.width / img.height);
      return sampleDraw(w, h, (c, cw, ch) => c.drawImage(img, 0, 0, cw, ch));
    };

    const shapeFromText = (
      text: string,
      opts: { maxFont: number; weight: number; upper?: boolean },
    ): Pt[] => {
      const measure = document.createElement("canvas").getContext("2d")!;
      let fontPx = Math.min(cssW * 0.09, opts.maxFont);
      const setFont = () =>
        (measure.font = `${opts.weight} ${fontPx}px Archivo, system-ui, sans-serif`);
      setFont();
      let m = measure.measureText(text);
      const maxW = cssW * 0.84;
      if (m.width > maxW) {
        fontPx *= maxW / m.width;
        setFont();
        m = measure.measureText(text);
      }
      const pad = fontPx * 0.4;
      const w = m.width + pad * 2;
      const h = fontPx * 1.5;
      return sampleDraw(w, h, (c, cw, ch) => {
        c.fillStyle = "#fff";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.font = `${opts.weight} ${fontPx}px Archivo, system-ui, sans-serif`;
        c.fillText(text, cw / 2, ch / 2);
      });
    };

    const computeShapes = () => {
      if (isoImg) {
        gPts = shapeFromImage(isoImg);
      } else {
        gPts = shapeFromText("g", { maxFont: 320, weight: 600 });
      }
      t1Pts = shapeFromText(introText.frase, { maxFont: 88, weight: 500 });
      t2Pts = shapeFromText(introText.singular, { maxFont: 150, weight: 700 });
      for (let i = 0; i < P; i++) {
        fldX[i] = cssW / 2 + fieldNorm[i].x * cssW * 0.98;
        fldY[i] = cssH / 2 + fieldNorm[i].y * cssH * 0.98;
      }
    };

    const initParticles = () => {
      for (let i = 0; i < P; i++) {
        if (mode === "ceremony") {
          // Materia dispersa que luego converge al centro.
          cx[i] = Math.random() * cssW;
          cy[i] = Math.random() * cssH;
        } else {
          cx[i] = fldX[i];
          cy[i] = fldY[i];
        }
      }
    };

    const targetFor = (e: number): { shape: Pt[] | null } => {
      if (e < HOLD_END) return { shape: gPts };
      if (e < T1_END) return { shape: t1Pts };
      if (e < T2_END) return { shape: t2Pts };
      if (e < INTRO_END) return { shape: gPts };
      return { shape: null }; // campo
    };

    const drawParticle = (
      i: number,
      x: number,
      y: number,
      alphaRamp: number,
    ) => {
      const d = fieldNorm[i].depth;
      // Estado "shape" (blanco nítido) vs campo (mayormente desenfocado).
      let fA: number;
      let fR: number;
      let r: number;
      let g: number;
      let b: number;
      const focused = d > 0.5 && d < 0.63;
      if (focused) {
        fA = 0.55;
        fR = 1.3;
        r = g = b = 235;
      } else if (d < 0.4) {
        fA = 0.16;
        fR = 0.9 + d;
        r = 150;
        g = 160;
        b = 220; // rastros de violeta/azul en el plano lejano
      } else if (d > 0.85) {
        fA = 0.07;
        fR = 2.6 + (d - 0.85) * 10;
        r = g = b = 210; // primer plano muy desenfocado
      } else {
        fA = 0.22;
        fR = 1.0;
        r = g = b = 200;
      }
      const R = lerp(1.6, fR, fieldMix);
      const A = lerp(1, fA, fieldMix) * alphaRamp;
      const cr = lerp(255, r, fieldMix) | 0;
      const cg = lerp(255, g, fieldMix) | 0;
      const cb = lerp(255, b, fieldMix) | 0;
      ctx.globalAlpha = A;
      ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = (now: number) => {
      const e = now - start;
      const { shape } = targetFor(e);
      const inField = shape === null;
      fieldMix += ((inField ? 1 : 0) - fieldMix) * 0.05;
      const alphaRamp = Math.min(e / FADE_IN, 1);

      ctx.globalAlpha = 1;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cssW, cssH);

      const levit = Math.sin(now * 0.001) * 1.0;
      for (let i = 0; i < P; i++) {
        let tx: number;
        let ty: number;
        if (inField) {
          const drift = 0.0003;
          tx = fldX[i] + Math.sin(now * drift + phases[i]) * 8 * (0.3 + fieldNorm[i].depth);
          ty = fldY[i] + Math.cos(now * drift + phases[i]) * 8 * (0.3 + fieldNorm[i].depth);
        } else {
          tx = shape[i]?.x ?? cssW / 2;
          ty = shape[i]?.y ?? cssH / 2;
        }
        cx[i] += (tx - cx[i]) * LERP_K;
        cy[i] += (ty - cy[i]) * LERP_K;
        const px = cx[i] + pointer.x * 14 * fieldNorm[i].depth * fieldMix;
        const py = cy[i] + (inField ? 0 : levit);
        drawParticle(i, px, py, alphaRamp);
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(render);
    };

    const drawOnce = () => {
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cssW, cssH);
      fieldMix = 1;
      for (let i = 0; i < P; i++) drawParticle(i, fldX[i], fldY[i], 1);
      ctx.globalAlpha = 1;
    };

    const onPointer = (ev: PointerEvent) => {
      pointer.x = (ev.clientX / cssW) * 2 - 1;
      pointer.y = (ev.clientY / cssH) * 2 - 1;
    };
    const onResize = () => {
      sizeCanvas();
      computeShapes();
    };

    let cancelled = false;
    const timers: number[] = [];

    const begin = () => {
      if (cancelled) return;
      sizeCanvas();
      computeShapes();
      initParticles();

      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onPointer);

      if (mode === "frozen") {
        // reduced-motion: estado estable, sin animación.
        drawOnce();
        setAnimate(false);
        setPhase("done");
        return;
      }

      if (mode === "ambient") {
        // Visita posterior: campo en movimiento, texto completo, sin ceremonia.
        setAnimate(false);
        start = performance.now() - (INTRO_END + 3000);
        setPhase("done");
        raf = requestAnimationFrame(render);
        return;
      }

      // Ceremonia completa (primera visita).
      setAnimate(true);
      setPhase("ceremony");
      start = performance.now();
      raf = requestAnimationFrame(render);
      timers.push(
        window.setTimeout(() => setPhase("manifesto"), MANIFESTO_START),
      );
      const done = MANIFESTO_START + manifestoTypingDuration() + 800;
      timers.push(
        window.setTimeout(() => {
          markIntroSeen();
          setPhase("done");
        }, done),
      );
    };

    loadImage("/brand/isomenu.svg")
      .then((img) => {
        isoImg = img;
      })
      .catch(() => {
        isoImg = null;
      })
      .finally(begin);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.forEach((t) => clearTimeout(t));
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  const revealManifesto = phase === "manifesto" || phase === "done";
  const foreground = animate && phase !== "done";

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden
        className={
          foreground
            ? "pointer-events-none fixed inset-0 z-40"
            : "pointer-events-none fixed inset-0 -z-10"
        }
      />
      <div className="relative z-50 px-6">
        <Manifesto reveal={revealManifesto} animate={animate} />
      </div>
    </section>
  );
}
