import { cn } from "@/lib/utils";
import { hasCloudinary } from "@/lib/media/cloudinary";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import type { MediaSource } from "@/types/content";

/**
 * Capa de media del sitio: las secciones nunca usan <video>/<img> directo.
 * Resuelve, en este orden: imágenes de Cloudinary (CDN, AVIF/WebP responsive),
 * archivos locales, video, o un placeholder editorial. Mux (video) se conecta
 * después por esta misma interfaz.
 */
export function MediaFrame({
  media,
  className,
  sizes = "(max-width: 768px) 100vw, 66vw",
}: {
  media: MediaSource;
  className?: string;
  sizes?: string;
}) {
  // Imagen desde Cloudinary (cuando hay Cloud name configurado).
  if (media.kind === "image" && media.cloudinaryId && hasCloudinary) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        <CloudinaryImage
          id={media.cloudinaryId}
          alt={media.alt}
          sizes={sizes}
          priority={media.priority === "critical"}
          className="object-cover"
        />
      </div>
    );
  }

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
