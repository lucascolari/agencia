import { cn } from "@/lib/utils";
import type { MediaSource } from "@/types/content";

/**
 * Capa de media del sitio: las secciones nunca usan <video>/<img> directo.
 * Hoy resuelve archivos locales y placeholders editoriales; en fase 6 pasa a
 * resolver URLs de Mux/Cloudinary sin cambiar la interfaz.
 */
export function MediaFrame({
  media,
  className,
}: {
  media: MediaSource;
  className?: string;
}) {
  if (media.kind === "video" && media.src) {
    return (
      <video
        className={cn("h-full w-full object-cover", className)}
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        preload={media.priority === "critical" ? "auto" : "none"}
        aria-label={media.alt}
      />
    );
  }

  if (media.kind === "image" && media.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- capa local; en fase 6 pasa a Cloudinary con next/image
      <img
        className={cn("h-full w-full object-cover", className)}
        src={media.src}
        alt={media.alt}
        loading={media.priority === "critical" ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={media.alt}
      className={cn(
        "relative flex h-full w-full items-end overflow-hidden",
        className,
      )}
      style={{ backgroundColor: media.tone ?? "var(--surface)" }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[0.08em] -top-[0.28em] select-none font-display text-[14rem] font-semibold leading-none text-text opacity-[0.07]"
      >
        {media.alt.charAt(0).toUpperCase()}
      </span>
      <span className="relative p-5 text-label uppercase tracking-[0.24em] text-text opacity-60">
        {media.alt}
      </span>
    </div>
  );
}
