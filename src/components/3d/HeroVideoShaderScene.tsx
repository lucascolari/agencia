"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Hls from "hls.js";
import { getAudioBands, setAudioSource } from "@/lib/audio/audioReactive";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uPlaneAspect;
  uniform float uVideoAspect;
  uniform float uHover;
  uniform float uAudio;

  // UV "cover": llena el plano sin deformar el video.
  vec2 coverUv(vec2 uv) {
    vec2 s = uv;
    if (uPlaneAspect > uVideoAspect) {
      s.y = (uv.y - 0.5) * (uVideoAspect / uPlaneAspect) + 0.5;
    } else {
      s.x = (uv.x - 0.5) * (uPlaneAspect / uVideoAspect) + 0.5;
    }
    return s;
  }

  void main() {
    vec2 uv = coverUv(vUv);
    float d = distance(vUv, uMouse);
    // Efecto concentrado cerca del cursor (no deforma todo el video).
    float falloff = smoothstep(0.45, 0.0, d);

    // Con el sonido activo el reel "late" con la música (uAudio 0..1).
    float beat = uAudio;

    // Ondulación sutil hacia el puntero + latido idle apenas perceptible.
    vec2 dir = normalize(vUv - uMouse + 0.0001);
    float ripple = sin(d * 14.0 - uTime * 2.2) * 0.008 * falloff * uHover;
    // Onda que recorre todo el plano al ritmo del audio (independiente del mouse).
    float pulse = sin(vUv.y * 10.0 - uTime * 4.0) * 0.01 * beat;
    float idle = sin(uTime * 0.5 + vUv.y * 6.0) * 0.0007;
    uv += dir * ripple + vec2(idle + pulse, pulse * 0.5);

    // RGB-split leve, cerca del puntero y reforzado por el ritmo.
    float split = (0.008 * falloff * uHover) + 0.006 * beat;
    float r = texture2D(uTexture, uv + dir * split).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - dir * split).b;
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

function useMuxTexture(playbackId: string) {
  // Refs (no estado): la escena WebGL solo corre en cliente y lee estos valores
  // cada frame en useFrame; evita re-renders y set-state-in-effect.
  const texRef = useRef<THREE.VideoTexture | null>(null);
  const aspect = useRef(16 / 9);

  useEffect(() => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");

    const src = `https://stream.mux.com/${playbackId}.m3u8`;
    let hls: Hls | null = null;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src; // Safari: HLS nativo
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
    }

    const onMeta = () => {
      if (video.videoWidth) aspect.current = video.videoWidth / video.videoHeight;
    };
    video.addEventListener("loadedmetadata", onMeta);

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texRef.current = texture;
    // Queda disponible para el botón "activar sonido": el reel es la fuente de
    // audio de toda la web. Sigue muteado hasta que el usuario lo active.
    setAudioSource(video);
    void video.play().catch(() => {});

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      setAudioSource(null);
      hls?.destroy();
      video.pause();
      video.removeAttribute("src");
      video.load();
      texture.dispose();
      texRef.current = null;
    };
  }, [playbackId]);

  return { texRef, aspect };
}

function VideoPlane({
  playbackId,
  reduced,
}: {
  playbackId: string;
  reduced: boolean;
}) {
  const { texRef, aspect } = useMuxTexture(playbackId);
  const { viewport, size } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const hover = useRef(0);

  // El canvas tiene pointer-events:none (no tapa los clicks del hero), así que
  // leemos el puntero desde la ventana en coordenadas UV (0..1, con y hacia arriba).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouseTarget.current.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight,
      );
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: null as THREE.Texture | null },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uPlaneAspect: { value: 1 },
      uVideoAspect: { value: 16 / 9 },
      uHover: { value: 0 },
      uAudio: { value: 0 },
    }),
    [],
  );

  useFrame((_state, dt) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    if (texRef.current) u.uTexture.value = texRef.current;
    u.uVideoAspect.value = aspect.current;
    u.uPlaneAspect.value = size.width / size.height;
    u.uTime.value += dt;
    mouse.current.lerp(mouseTarget.current, 0.1);
    u.uMouse.value.copy(mouse.current);
    hover.current += ((reduced ? 0 : 1) - hover.current) * 0.05;
    u.uHover.value = hover.current;
    // Latido al ritmo del reel cuando el usuario activó el sonido.
    u.uAudio.value = getAudioBands().level;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
      />
    </mesh>
  );
}

export default function HeroVideoShaderScene({
  playbackId,
  reduced,
}: {
  playbackId: string;
  reduced: boolean;
}) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false }}
      style={{ pointerEvents: "none" }}
    >
      <VideoPlane playbackId={playbackId} reduced={reduced} />
    </Canvas>
  );
}
