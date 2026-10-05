"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "next-view-transitions";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  introSeenThisSession,
  markIntroSeen,
  setIntroPhase,
  type IntroPhase,
} from "@/lib/intro/introState";
import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import {
  introText,
  manifestoLocation,
  manifestoParagraphs,
} from "@/lib/content/manifesto";
import { makeRng } from "@/lib/intro/particles";
import {
  DISINTEGRATION_WINDOWS,
  erosion,
  type BlockKey,
} from "@/lib/intro/disintegration";
import { Manifesto, manifestoTypingDuration } from "./Manifesto";

/**
 * Primera pantalla de Gular (Fichas 00–02 del diseñador).
 *
 * Todo se dibuja con los SVG originales, NÍTIDOS (no reconstruido por partículas,
 * como exige el doc). Secuencia sobre negro absoluto:
 *   "g" → "No hay solución" → "SINGULAR" → "g" → primera pantalla
 *   (logo arriba-izq + iso rotando arriba-der + manifiesto escrito).
 *
 * Silenciosa, sin botón de saltar, sin mensajes de carga, scroll bloqueado hasta
 * terminar, una vez por sesión. Con reduced-motion o en visitas posteriores entra
 * directo al estado estable.
 *
 * PENDIENTE de assets del diseñador para quedar EXACTO: la transformación
 * "materia que se transforma" (COREC*.svg + gularintro.mp4), las tipografías
 * oficiales (acá van temporales) y Slide 16_9-1.png para la composición fina.
 */

type Step = "g1" | "frase" | "singular" | "g2" | "stable";

// Marca temporal del recorrido (ms). Se afinará contra gularintro.mp4.
const T_FRASE = 2200;
const T_SINGULAR = 4600;
const T_G2 = 7000;
const T_STABLE = 8800;

const EASE = [0.83, 0, 0.17, 1] as const;
const ISO_RATIO = 164 / 255; // ancho/alto del isologo
const LOGO_RATIO = 286 / 137; // ancho/alto del logotipo

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Silueta SVG nítida vía CSS mask (escalable, recoloreable, sin rasterizar). */
function SvgMark({
  src,
  className,
  style,
}: {
  src: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: "block",
        backgroundColor: "#fff",
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        ...style,
      }}
    />
  );
}

export function GularIntro() {
  const [step, setStep] = useState<Step>("g1");
  const [animate, setAnimate] = useState(true);
  const [phase, setPhase] = useState<IntroPhase>("pending");
  const [menuOpen, setMenuOpen] = useState(false);
  const decided = useRef(false);
  const nav = getUiStrings(siteConfig.locale).nav;
  const sectionRef = useRef<HTMLElement>(null);
  const manifestoWrapRef = useRef<HTMLDivElement>(null);
  const disCanvasRef = useRef<HTMLCanvasElement>(null);
  const ceremonyCanvasRef = useRef<HTMLCanvasElement>(null);

  // Refleja la fase en <html data-intro> (el header se oculta en la home).
  useEffect(() => {
    document.documentElement.dataset.intro = phase;
    setIntroPhase(phase);
    return () => {
      delete document.documentElement.dataset.intro;
    };
  }, [phase]);

  // Bloqueo de scroll durante la ceremonia/escritura.
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

  // Cerrar el menú con Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Orquestación de la secuencia.
  useEffect(() => {
    if (decided.current) return;
    decided.current = true;

    // Decisión solo-cliente (reduced-motion / visita ya vista): no puede correr
    // en SSR y define el arranque de la secuencia. Excepción válida.
    /* eslint-disable react-hooks/set-state-in-effect */
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const seen = introSeenThisSession();

    if (reduced || seen) {
      // Estado estable directo: sin ceremonia.
      setAnimate(false);
      setStep("stable");
      setPhase("done");
      return;
    }

    const timers: number[] = [];
    setAnimate(true);
    setStep("g1");
    setPhase("ceremony");
    timers.push(window.setTimeout(() => setStep("frase"), T_FRASE));
    timers.push(window.setTimeout(() => setStep("singular"), T_SINGULAR));
    timers.push(window.setTimeout(() => setStep("g2"), T_G2));
    timers.push(
      window.setTimeout(() => {
        setStep("stable");
        setPhase("manifesto");
      }, T_STABLE),
    );
    const doneAt = T_STABLE + manifestoTypingDuration() + 800;
    timers.push(
      window.setTimeout(() => {
        markIntroSeen();
        setPhase("done");
      }, doneAt),
    );
    /* eslint-enable react-hooks/set-state-in-effect */
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  // Ficha 00/01 — ecos de materia en las transiciones de la intro: cuando una
  // forma (la "g" o un texto) deja lugar a la siguiente, no se funde: se
  // descompone en partículas que se dispersan (Capa 03 "ecos de movimiento").
  // Capa de ecos sobre las formas nítidas. Placeholder con el isologo/fuente
  // temporal hasta tener los COREC y la tipografía oficial.
  useEffect(() => {
    const canvas = ceremonyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      introSeenThisSession()
    ) {
      return; // visitas posteriores / reduced-motion: sin ceremonia
    }

    const mobile =
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    let cssW = window.innerWidth;
    let cssH = window.innerHeight;
    const rng = makeRng(5150);
    const COUNT = mobile ? 900 : 1600;

    const sizeCanvas = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    type Pt2 = { x: number; y: number };
    const sampleDraw = (
      w: number,
      h: number,
      draw: (c: CanvasRenderingContext2D, w: number, h: number) => void,
    ): Pt2[] => {
      const off = document.createElement("canvas");
      const sc = Math.min(window.devicePixelRatio || 1, 2);
      off.width = Math.max(1, Math.ceil(w * sc));
      off.height = Math.max(1, Math.ceil(h * sc));
      const octx = off.getContext("2d");
      if (!octx) return [];
      octx.scale(sc, sc);
      draw(octx, w, h);
      const data = octx.getImageData(0, 0, off.width, off.height).data;
      const lit: number[] = [];
      const n = off.width * off.height;
      for (let i = 0; i < n; i++) if (data[i * 4 + 3] > 100) lit.push(i);
      const out: Pt2[] = [];
      if (!lit.length) return out;
      const cxp = cssW / 2;
      const cyp = cssH / 2;
      for (let i = 0; i < COUNT; i++) {
        const idx = lit[(rng() * lit.length) | 0];
        out.push({
          x: cxp + ((idx % off.width) / sc - w / 2),
          y: cyp + (((idx / off.width) | 0) / sc - h / 2),
        });
      }
      return out;
    };

    let gPts: Pt2[] = [];
    let t1Pts: Pt2[] = [];
    let t2Pts: Pt2[] = [];

    const textShape = (text: string, maxFont: number, weight: number) => {
      const measure = document.createElement("canvas").getContext("2d");
      if (!measure) return [];
      let fontPx = Math.min(cssW * 0.09, maxFont);
      const setF = () =>
        (measure.font = `${weight} ${fontPx}px Archivo, system-ui, sans-serif`);
      setF();
      let m = measure.measureText(text);
      const maxW = cssW * 0.84;
      if (m.width > maxW) {
        fontPx *= maxW / m.width;
        setF();
        m = measure.measureText(text);
      }
      const pad = fontPx * 0.4;
      return sampleDraw(m.width + pad * 2, fontPx * 1.5, (c, w, h) => {
        c.fillStyle = "#fff";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.font = `${weight} ${fontPx}px Archivo, system-ui, sans-serif`;
        c.fillText(text, w / 2, h / 2);
      });
    };

    const sampleAll = (img: HTMLImageElement | null) => {
      const gh = Math.min(cssH * 0.38, 320);
      if (img) {
        const gw = gh * (img.width / img.height);
        gPts = sampleDraw(gw, gh, (c, w, h) => c.drawImage(img, 0, 0, w, h));
      } else {
        gPts = textShape("g", 320, 600);
      }
      t1Pts = textShape(introText.frase, 88, 500);
      t2Pts = textShape(introText.singular, 150, 700);
    };

    const WIN = 720;
    const transitions: { t: number; getPts: () => Pt2[] }[] = [
      { t: T_FRASE, getPts: () => gPts },
      { t: T_SINGULAR, getPts: () => t1Pts },
      { t: T_G2, getPts: () => t2Pts },
      { t: T_STABLE, getPts: () => gPts },
    ];

    let start = 0;
    let raf = 0;
    let cancelled = false;

    const render = (now: number) => {
      ctx.clearRect(0, 0, cssW, cssH);
      const e = now - start;
      const cxp = cssW / 2;
      const cyp = cssH / 2;
      ctx.fillStyle = "#f2f0eb";
      for (const tr of transitions) {
        const local = (e - (tr.t - 60)) / (WIN + 60);
        if (local <= 0 || local >= 1) continue;
        const pts = tr.getPts();
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          const ox = p.x - cxp;
          const oy = p.y - cyp;
          const dist = Math.hypot(ox, oy) || 1;
          const jitter = ((i * 2654435761) % 1000) / 1000 - 0.5;
          const spread = (90 + jitter * 120) * local;
          const x = p.x + (ox / dist) * spread + jitter * 14;
          const y = p.y + (oy / dist) * spread - local * 46;
          ctx.globalAlpha = (1 - local) * 0.85;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (!cancelled && e < T_STABLE + WIN + 200) {
        raf = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, cssW, cssH);
      }
    };

    const onResize = () => sizeCanvas();

    const begin = (img: HTMLImageElement | null) => {
      if (cancelled) return;
      sizeCanvas();
      sampleAll(img);
      start = performance.now();
      raf = requestAnimationFrame(render);
      window.addEventListener("resize", onResize);
    };

    loadImage("/brand/isomenu.svg")
      .then((img) => begin(img))
      .catch(() => begin(null));

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Ficha 03 — Desintegración del manifiesto con el primer scroll. Se arma solo
  // cuando la primera pantalla ya está estable (scroll habilitado). Los glifos
  // (DOM, nítidos) se disuelven mientras liberan partículas que ascienden y se
  // integran al campo. Todo es función del progreso de scroll ⇒ reversible.
  useEffect(() => {
    if (phase !== "done") return;
    const canvas = disCanvasRef.current;
    const section = sectionRef.current;
    const wrap = manifestoWrapRef.current;
    if (!canvas || !section || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mobile =
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768;
    const TARGET = reduced ? 1600 : mobile ? 3000 : 5600;
    const TEXT_COLOR = "#f2f0eb";

    type P = {
      x: number;
      y: number;
      win: [number, number];
      rand: number;
      ph: number;
      rise: number;
      // Hogar en el campo residual (Ficha 04): adonde se integra la materia.
      fx: number;
      fy: number;
      fdepth: number;
      // Ficha 05: a qué flujo pertenece (-1 izq, 0 centro, 1 der) y su velocidad.
      flow: number;
      speed: number;
    };
    // Recorrido pineado dividido en fichas (en múltiplos de viewport).
    const F03_SPAN = mobile ? 0.9 : 1.0; // desintegración
    const F04_SPAN = mobile ? 0.35 : 0.45; // campo residual
    const F05_SPAN = mobile ? 0.68 : 0.9; // avance en profundidad + 3 flujos
    const F06_SPAN = mobile ? 0.52 : 0.7; // formación de los 3 núcleos
    const TOTAL_SPAN = F03_SPAN + F04_SPAN + F05_SPAN + F06_SPAN;
    const FR03 = F03_SPAN / TOTAL_SPAN;
    const FR04 = (F03_SPAN + F04_SPAN) / TOTAL_SPAN;
    const FR05 = (F03_SPAN + F04_SPAN + F05_SPAN) / TOTAL_SPAN;
    let parts: P[] = [];
    let blocks: HTMLElement[] = [];
    let blockWins: Array<[number, number]> = [];
    let cssW = 0;
    let cssH = 0;
    const rng = makeRng(90321);

    const sizeCanvas = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const textFor = (key: BlockKey): string =>
      key === "loc"
        ? manifestoLocation
        : key === "b0"
          ? manifestoParagraphs[0]
          : key === "b1"
            ? manifestoParagraphs[1]
            : manifestoParagraphs[2];

    // Renderiza un bloque a un canvas offscreen (misma fuente y ancho que el DOM)
    // y devuelve los índices de píxeles "encendidos" + escala + ancho.
    const renderBlockLit = (el: HTMLElement, rect: DOMRect) => {
      const cs = getComputedStyle(el);
      const fontPx = parseFloat(cs.fontSize);
      const lineH = parseFloat(cs.lineHeight) || fontPx * 1.4;
      const sc = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.ceil(rect.width));
      const h = Math.max(1, Math.ceil(rect.height));
      const off = document.createElement("canvas");
      off.width = Math.ceil(w * sc);
      off.height = Math.ceil(h * sc);
      const octx = off.getContext("2d");
      if (!octx) return null;
      octx.scale(sc, sc);
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "top";
      octx.font = `${cs.fontStyle} ${cs.fontWeight} ${fontPx}px ${cs.fontFamily}`;
      const words = textFor(el.dataset.mblock as BlockKey).split(" ");
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (octx.measureText(test).width > w && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      const totalH = lines.length * lineH;
      const yOff = Math.max(0, (h - totalH) / 2);
      lines.forEach((ln, i) =>
        octx.fillText(ln, w / 2, yOff + i * lineH + (lineH - fontPx) / 2),
      );
      const data = octx.getImageData(0, 0, off.width, off.height).data;
      const lit: number[] = [];
      const n = off.width * off.height;
      for (let i = 0; i < n; i++) if (data[i * 4 + 3] > 100) lit.push(i);
      return { lit, sc, ow: off.width };
    };

    const build = () => {
      blocks = Array.from(
        section.querySelectorAll<HTMLElement>("[data-mblock]"),
      );
      const rects = blocks.map((el) => el.getBoundingClientRect());
      const totalArea =
        rects.reduce((s, r) => s + r.width * r.height, 0) || 1;
      blockWins = blocks.map(
        (el) => DISINTEGRATION_WINDOWS[el.dataset.mblock as BlockKey],
      );
      parts = [];
      blocks.forEach((el, bi) => {
        const rect = rects[bi];
        const info = renderBlockLit(el, rect);
        if (!info || info.lit.length === 0) return;
        const win = blockWins[bi];
        const cnt = Math.max(
          1,
          Math.round((TARGET * (rect.width * rect.height)) / totalArea),
        );
        for (let i = 0; i < cnt; i++) {
          const idx = info.lit[(rng() * info.lit.length) | 0];
          const px = (idx % info.ow) / info.sc;
          const py = ((idx / info.ow) | 0) / info.sc;
          // Hogar en el campo residual, con el centro despejado (elipse).
          let fnx = rng() - 0.5;
          let fny = rng() - 0.5;
          let guard = 0;
          while (Math.hypot(fnx, fny * 1.6) < 0.17 && guard < 8) {
            fnx = rng() - 0.5;
            fny = rng() - 0.5;
            guard++;
          }
          parts.push({
            x: rect.left + px,
            y: rect.top + py,
            win,
            rand: rng(),
            ph: rng() * Math.PI * 2,
            rise: 60 + rng() * 160,
            fx: cssW / 2 + fnx * cssW * 0.96,
            fy: cssH / 2 + fny * cssH * 0.9,
            fdepth: rng(),
            flow: (() => {
              const fr = rng();
              return fr < 0.3 ? -1 : fr < 0.65 ? 0 : 1;
            })(),
            speed: 0.6 + rng() * 0.7,
          });
        }
      });
    };

    let progress = 0;
    let raf = 0;
    const riseScale = reduced ? 0.3 : 1;
    const lateralAmp = reduced ? 2 : 10;
    const smooth = (a: number, b: number, x: number) => {
      const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    // Posición de una partícula en la Ficha 05 (avance en profundidad + 3 flujos).
    // Se reutiliza como punto de partida de la Ficha 06.
    const f05pos = (p: P, p05val: number) => {
      const cxv = cssW / 2;
      const cyv = cssH / 2;
      const adv = Math.min(p05val * p.speed, 1) * (1 - p.fdepth * 0.55);
      const out = 1 + adv * (reduced ? 0.8 : 1.9);
      let px = cxv + (p.fx - cxv) * out;
      const py = cyv + (p.fy - cyv) * out;
      const flowBlend = smooth(0.2, 0.95, p05val);
      const colX = cxv + p.flow * cssW * 0.24;
      const pull = p.flow === 0 ? 0.55 : 0.4;
      const converge = smooth(0.82, 1, p05val);
      const targetX = px + (colX - px) * (pull + converge * 0.25);
      px += (targetX - px) * flowBlend;
      return { px, py, adv };
    };

    // Centros de los 3 núcleos (Ficha 06). Asimétricos: distinta escala, altura y
    // densidad. El central (Yuze) es más chico/cohesivo; los laterales más abiertos.
    const nucleus = (flow: number) =>
      flow === -1
        ? { x: cssW * 0.27, y: cssH * 0.54, r: cssW * 0.1 }
        : flow === 0
          ? { x: cssW * 0.5, y: cssH * 0.46, r: cssW * 0.075 }
          : { x: cssW * 0.73, y: cssH * 0.57, r: cssW * 0.105 };

    const render = (now: number) => {
      ctx.clearRect(0, 0, cssW, cssH);
      // Progreso dividido por ficha (F03 desint. → F04 residual → F05 profundidad
      // → F06 núcleos). Todo función del scroll ⇒ reversible.
      const p03 = FR03 > 0 ? Math.min(progress / FR03, 1) : 1;
      const p04 = Math.max(0, Math.min((progress - FR03) / (FR04 - FR03), 1));
      const p05 = Math.max(0, Math.min((progress - FR04) / (FR05 - FR04), 1));
      const p06 = FR05 < 1 ? Math.max(0, (progress - FR05) / (1 - FR05)) : 0;

      // Disolución de cada glifo (DOM) según la erosión de su bloque.
      for (let b = 0; b < blocks.length; b++) {
        const [a, z] = blockWins[b];
        const be = p03 <= a ? 0 : p03 >= z ? 1 : (p03 - a) / (z - a);
        blocks[b].style.opacity = String(1 - be);
      }

      ctx.fillStyle = TEXT_COLOR;

      if (p06 > 0) {
        // Ficha 06 — formación de 3 núcleos granulares. La materia se concentra
        // alrededor de 3 centros; el central (Yuze) gana presencia, foco y un matiz
        // azul petróleo; los laterales (Jolly izq, NÓMADES der) más abiertos y
        // desenfocados. Órbitas parciales e irregulares (sin rotación completa).
        const form = smooth(0, 0.65, p06);
        const central = smooth(0.5, 1, p06);
        const osc = reduced ? 0.5 : 1;
        for (const p of parts) {
          const start = f05pos(p, 1);
          const nc = nucleus(p.flow);
          const isCenter = p.flow === 0;
          const rr =
            nc.r * (0.18 + p.fdepth * 0.95) * (isCenter ? 1 - central * 0.3 : 1);
          const ang = p.ph;
          const clusterX = nc.x + Math.cos(ang) * rr;
          const clusterY = nc.y + Math.sin(ang) * rr * 1.12;
          const px =
            start.px +
            (clusterX - start.px) * form +
            Math.sin(now * 0.0005 + ang) * 2 * osc;
          const py =
            start.py +
            (clusterY - start.py) * form +
            Math.cos(now * 0.00055 + ang) * 2 * osc;
          const focusedFrag = isCenter && p.fdepth > 0.55;
          const size = focusedFrag ? 1 : isCenter ? 0.9 : 1.1 + p.fdepth * 0.5;
          let alpha = isCenter ? 0.2 + p.fdepth * 0.25 : 0.12 + p.fdepth * 0.1;
          if (focusedFrag) alpha = 0.45 + central * 0.1;
          if (isCenter) {
            const t = central * (0.3 + p.fdepth * 0.5);
            const cr = Math.round(242 + (46 - 242) * t);
            const cg = Math.round(240 + (86 - 240) * t);
            const cb = Math.round(235 + (112 - 235) * t);
            ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
          } else {
            ctx.fillStyle = TEXT_COLOR;
          }
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = TEXT_COLOR;
      } else if (p05 > 0) {
        // Ficha 05 — avance en profundidad (cámara fija) + separación en 3 flujos.
        const driftAmp = reduced ? 1.5 : 3;
        for (const p of parts) {
          const base = f05pos(p, p05);
          const px = base.px + Math.cos(now * 0.00045 + p.ph) * driftAmp;
          const py = base.py + Math.sin(now * 0.0004 + p.ph) * driftAmp;
          const size = (0.7 + p.fdepth * 0.5) * (1 + base.adv * 2.4);
          let alpha: number;
          if (base.adv > 0.72) alpha = 0.1;
          else if (p.fdepth > 0.42 && p.fdepth < 0.6) alpha = 0.5;
          else alpha = 0.16 + p.fdepth * 0.12;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Ficha 03 — partículas liberadas que ascienden y se integran al campo.
        for (const p of parts) {
          const e = erosion(p03, p.win, p.rand);
          if (e <= 0 || e >= 1) continue;
          const rise = e * p.rise * riseScale;
          const lateral = Math.sin(now * 0.0012 + p.ph) * e * lateralAmp;
          ctx.globalAlpha = Math.min(e * 4, 1) * (1 - e);
          ctx.beginPath();
          ctx.arc(p.x + lateral, p.y - rise, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
        // Ficha 04 — campo residual: la materia deriva y pierde energía. Centro
        // vacío; al final una tensión previa anticipa la Ficha 05.
        if (p04 > 0) {
          const settle = smooth(0, 0.3, p04);
          const energy = 1 - smooth(0.3, 0.85, p04);
          const tension = smooth(0.85, 1, p04);
          for (const p of parts) {
            const amp =
              (2 + p.fdepth * 6) * (0.35 + energy * 0.65) * (reduced ? 0.4 : 1);
            const dx = Math.sin(now * 0.0004 + p.ph) * amp;
            const dy = Math.cos(now * 0.00045 + p.ph * 1.3) * amp;
            const curve = tension * Math.sin(p.ph * 3 + now * 0.0006) * 7;
            const focused = p.fdepth > 0.82;
            const baseA = focused ? 0.42 : 0.12 + p.fdepth * 0.08;
            ctx.globalAlpha = baseA * settle;
            ctx.beginPath();
            ctx.arc(p.fx + dx + curve, p.fy + dy, focused ? 1.2 : 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };

    // El ScrollTrigger (con pin) se crea dentro de un gsap.context para que el
    // pin-spacer que inserta en el DOM se revierta al desmontar; si no, React
    // falla al navegar fuera de la home ("This page couldn't load").
    let ctxGsap: ReturnType<typeof gsap.context> | null = null;
    const setup = () => {
      sizeCanvas();
      build();
      ctxGsap?.revert();
      ctxGsap = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * TOTAL_SPAN)}`,
          pin: true,
          anticipatePin: 1,
          scrub: reduced ? true : 0.4,
          onUpdate: (self) => {
            progress = self.progress;
          },
        });
      }, section);
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setup();
        ScrollTrigger.refresh();
      }, 200);
    };

    // Esperar a que las fuentes estén listas: el muestreo depende de las métricas.
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      setup();
      raf = requestAnimationFrame(render);
      window.addEventListener("resize", onResize);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      ctxGsap?.revert();
      blocks.forEach((el) => (el.style.opacity = ""));
    };
  }, [phase]);

  const stable = step === "stable";
  const revealManifesto = phase === "manifesto" || phase === "done";
  const trans = { duration: animate ? 0.7 : 0, ease: EASE };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* Negro absoluto de base (Ficha 00/01). Absolute (no fixed): al soltarse
          el pin se va con la primera pantalla y deja ver las secciones de abajo. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#000]" />

      {/* Ficha 03 — partículas liberadas por el manifiesto al desintegrarse. */}
      <canvas
        ref={disCanvasRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-30"
      />

      {/* Ficha 00/01 — ecos de partículas en las transiciones de la intro. */}
      <canvas
        ref={ceremonyCanvasRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-[31]"
      />

      {/* Esquinas de marca: logo (izq) e iso que rota (der). Aparecen al quedar
          constituida la primera pantalla. */}
      <div
        className={`pointer-events-none fixed inset-x-0 top-0 flex items-start justify-between p-6 transition-opacity duration-700 md:p-8 ${
          menuOpen ? "z-[var(--z-modal)]" : "z-40"
        }`}
        style={{ opacity: stable ? 1 : 0 }}
      >
        <Link href="/" className="pointer-events-auto" aria-label="gular — inicio">
          <SvgMark
            src="/brand/gularlogo.svg"
            style={{ height: "clamp(28px, 3vw, 40px)", width: `calc(clamp(28px, 3vw, 40px) * ${LOGO_RATIO})` }}
          />
        </Link>
        {/* Isologo = control de apertura del menú (Ficha 01). La cola de abajo
            gira y la parte de arriba queda fija: dos máscaras superpuestas. */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          className="pointer-events-auto relative block cursor-pointer p-0 [perspective:520px]"
          style={{ height: "clamp(40px, 4.5vw, 60px)", width: `calc(clamp(40px, 4.5vw, 60px) * ${ISO_RATIO})` }}
        >
          <SvgMark
            src="/brand/isomenu-top.svg"
            style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
          />
          <SvgMark
            src="/brand/isomenu-tail.svg"
            className={animate ? "iso-spin" : undefined}
            style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
          />
        </button>
      </div>

      {/* Menú de navegación (lo abre el iso). Versión sobria provisional hasta la
          ficha de menú del diseñador. */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[var(--z-overlay)] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        >
          <nav
            aria-label="Principal"
            className="flex flex-col items-center gap-7"
            onClick={(e) => e.stopPropagation()}
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-4xl uppercase tracking-[0.12em] text-text transition-colors duration-300 hover:text-accent md:text-6xl"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <span className="pointer-events-none absolute bottom-10 text-label uppercase tracking-[0.24em] text-muted">
            Esc para cerrar
          </span>
        </div>
      )}

      {/* Escenario central de la intro (la "g" y los textos, nítidos). */}
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!stable && (step === "g1" || step === "g2") && (
            <motion.div
              key="g"
              initial={{ opacity: 0, scale: animate ? 0.94 : 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={trans}
            >
              <SvgMark
                src="/brand/isomenu.svg"
                style={{ height: "38vh", width: `calc(38vh * ${ISO_RATIO})` }}
              />
            </motion.div>
          )}

          {!stable && step === "frase" && (
            <motion.p
              key="frase"
              initial={{ opacity: 0, y: animate ? 12 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: animate ? -12 : 0 }}
              transition={trans}
              className="text-center text-4xl text-text md:text-6xl"
            >
              No hay{" "}
              <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}>
                solución
              </span>
            </motion.p>
          )}

          {!stable && step === "singular" && (
            <motion.p
              key="singular"
              initial={{ opacity: 0, y: animate ? 12 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: animate ? -12 : 0 }}
              transition={trans}
              className="text-center text-5xl font-semibold uppercase tracking-[0.08em] text-text md:text-8xl"
            >
              {introText.singular}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Manifiesto: se escribe al quedar constituida la pantalla. */}
      <div
        ref={manifestoWrapRef}
        className="relative z-20 w-full px-6 transition-opacity duration-700"
        style={{ opacity: stable ? 1 : 0 }}
      >
        <Manifesto reveal={revealManifesto} animate={animate} />
      </div>
    </section>
  );
}
