"use client";

import dynamic from "next/dynamic";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { MediaFrame } from "@/components/media/MediaFrame";
import type { MediaSource } from "@/types/content";

const Scene = dynamic(() => import("./HeroVideoShaderScene"), { ssr: false });

/**
 * Hero: el reel de Mux renderizado sobre un plano WebGL con shader de
 * distorsión + RGB-split que reacciona al cursor. Si el dispositivo no soporta
 * 3D (o hay reduced-motion / gama baja) cae al video normal, que ya respeta
 * esas condiciones. Requiere un video de Mux.
 */
export function HeroVideoShader({ media }: { media: MediaSource }) {
  const cap = useDeviceCapability();

  if (
    !cap.ready ||
    !cap.allow3D ||
    media.kind !== "mux" ||
    !media.playbackId
  ) {
    return <MediaFrame media={media} sizes="100vw" />;
  }

  return <Scene playbackId={media.playbackId} reduced={false} />;
}
