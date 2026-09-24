"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "next-view-transitions";
import { AnimatePresence, motion } from "motion/react";
import {
  introSeenThisSession,
  markIntroSeen,
  setIntroPhase,
  type IntroPhase,
} from "@/lib/intro/introState";
import { introText } from "@/lib/content/manifesto";
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
  const decided = useRef(false);

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

  const stable = step === "stable";
  const revealManifesto = phase === "manifesto" || phase === "done";
  const trans = { duration: animate ? 0.7 : 0, ease: EASE };

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Negro absoluto de base (Ficha 00/01). */}
      <div aria-hidden className="fixed inset-0 -z-10 bg-[#000]" />

      {/* Esquinas de marca: logo (izq) e iso que rota (der). Aparecen al quedar
          constituida la primera pantalla. */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between p-6 transition-opacity duration-700 md:p-8"
        style={{ opacity: stable ? 1 : 0 }}
      >
        <Link href="/" className="pointer-events-auto" aria-label="gular — inicio">
          <SvgMark
            src="/brand/gularlogo.svg"
            style={{ height: "clamp(28px, 3vw, 40px)", width: `calc(clamp(28px, 3vw, 40px) * ${LOGO_RATIO})` }}
          />
        </Link>
        <span
          className="[perspective:600px]"
          aria-label="gular"
          style={{ height: "clamp(40px, 4.5vw, 60px)", width: `calc(clamp(40px, 4.5vw, 60px) * ${ISO_RATIO})` }}
        >
          <SvgMark
            src="/brand/isomenu.svg"
            className={animate ? "iso-spin" : undefined}
            style={{ height: "100%", width: "100%" }}
          />
        </span>
      </div>

      {/* Escenario central de la intro (la "g" y los textos, nítidos). */}
      <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center">
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
        className="relative z-20 w-full px-6 transition-opacity duration-700"
        style={{ opacity: stable ? 1 : 0 }}
      >
        <Manifesto reveal={revealManifesto} animate={animate} />
      </div>
    </section>
  );
}
