/**
 * Motor de audio-reactividad compartido (singleton de módulo).
 *
 * El hero registra su elemento <video> del reel con `setAudioSource`. Cuando el
 * usuario toca "activar sonido" (gesto obligatorio: los navegadores no dejan
 * sonar solos), `enableAudio` arma el grafo Web Audio
 * (source → analyser → gain → destino) y arranca un loop que mide graves/medios/
 * agudos. Las escenas 3D leen esas bandas cada frame con `getAudioBands()` sin
 * provocar renders de React.
 *
 * Detalles finos:
 * - `createMediaElementSource` se puede llamar UNA sola vez por elemento; por eso
 *   se conserva el nodo y solo se sube/baja el `gain` al activar/silenciar.
 * - El volumen real lo controla el GainNode (no `video.muted`), así el análisis y
 *   el audio quedan sincronizados y sin clicks.
 * - Web Audio necesita CORS: el video usa crossOrigin="anonymous" y Mux sirve
 *   `Access-Control-Allow-Origin: *`, así que el audio no queda "tainted".
 */

type Bands = { level: number; bass: number; mid: number; treble: number };

const bands: Bands = { level: 0, bass: 0, mid: 0, treble: 0 };

let audioEl: HTMLMediaElement | null = null;
let ctx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let gain: GainNode | null = null;
let sourceNode: MediaElementAudioSourceNode | null = null;
let data: Uint8Array<ArrayBuffer> | null = null;
let raf = 0;
let active = false;

const activeListeners = new Set<(active: boolean) => void>();
const sourceListeners = new Set<(has: boolean) => void>();

/** Bandas de frecuencia normalizadas (0..1), suavizadas. Se lee cada frame. */
export function getAudioBands(): Bands {
  return bands;
}

export function isAudioActive(): boolean {
  return active;
}

export function hasAudioSource(): boolean {
  return audioEl !== null;
}

export function subscribeAudioActive(fn: (active: boolean) => void): () => void {
  activeListeners.add(fn);
  return () => {
    activeListeners.delete(fn);
  };
}

export function subscribeAudioSource(fn: (has: boolean) => void): () => void {
  sourceListeners.add(fn);
  return () => {
    sourceListeners.delete(fn);
  };
}

function emitActive() {
  for (const fn of activeListeners) fn(active);
}

function emitSource() {
  for (const fn of sourceListeners) fn(audioEl !== null);
}

function resetBands() {
  bands.level = 0;
  bands.bass = 0;
  bands.mid = 0;
  bands.treble = 0;
}

/**
 * Registra (o quita) el elemento multimedia fuente. Si cambia el elemento
 * —p. ej. al navegar y remontar el hero— se desarma el grafo anterior para poder
 * crear uno nuevo sobre el elemento nuevo.
 */
export function setAudioSource(el: HTMLMediaElement | null): void {
  if (el === audioEl) return;

  if (sourceNode) {
    try {
      sourceNode.disconnect();
    } catch {
      /* nodo ya desconectado */
    }
    sourceNode = null;
  }
  if (analyser) {
    try {
      analyser.disconnect();
    } catch {
      /* idem */
    }
    analyser = null;
  }
  gain = null;
  data = null;
  cancelAnimationFrame(raf);
  raf = 0;
  if (active) {
    active = false;
    emitActive();
  }
  resetBands();

  audioEl = el;
  emitSource();
}

function loop() {
  if (!analyser || !data) return;
  analyser.getByteFrequencyData(data);
  const n = data.length;
  const bassEnd = Math.max(1, Math.floor(n * 0.08));
  const midEnd = Math.max(bassEnd + 1, Math.floor(n * 0.4));

  let b = 0;
  let m = 0;
  let t = 0;
  for (let i = 0; i < bassEnd; i++) b += data[i];
  for (let i = bassEnd; i < midEnd; i++) m += data[i];
  for (let i = midEnd; i < n; i++) t += data[i];

  const bass = b / bassEnd / 255;
  const mid = m / (midEnd - bassEnd) / 255;
  const treble = t / (n - midEnd) / 255;

  // Suavizado exponencial: nada de saltos bruscos entre frames.
  const k = 0.25;
  bands.bass += (bass - bands.bass) * k;
  bands.mid += (mid - bands.mid) * k;
  bands.treble += (treble - bands.treble) * k;
  bands.level += (bass * 0.6 + mid * 0.3 + treble * 0.1 - bands.level) * k;

  raf = requestAnimationFrame(loop);
}

/** Arranca el audio + análisis. Debe llamarse desde un gesto del usuario. */
export async function enableAudio(): Promise<boolean> {
  const el = audioEl;
  if (!el) return false;

  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return false;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") await ctx.resume();

    if (!sourceNode) {
      sourceNode = ctx.createMediaElementSource(el);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      gain = ctx.createGain();
      gain.gain.value = 0;
      data = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
      sourceNode.connect(analyser);
      analyser.connect(gain);
      gain.connect(ctx.destination);
    }

    // El volumen lo maneja el grafo; el elemento debe dejar de estar muteado
    // para que el nodo fuente reciba señal.
    el.muted = false;
    if (el.paused) await el.play?.().catch(() => {});
    if (gain) {
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(1, now + 0.4);
    }

    active = true;
    emitActive();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
    return true;
  } catch {
    return false;
  }
}

/** Silencia (rampa a 0), frena el análisis y deja las bandas en reposo. */
export function disableAudio(): void {
  if (ctx && gain) {
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
  }
  active = false;
  cancelAnimationFrame(raf);
  raf = 0;
  resetBands();
  emitActive();
}

export async function toggleAudio(): Promise<boolean> {
  if (active) {
    disableAudio();
    return false;
  }
  return enableAudio();
}
