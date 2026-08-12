"use client";

import Image from "next/image";
import { cloudinaryLoader } from "@/lib/media/cloudinary";

/**
 * Imagen servida por Cloudinary con next/image. Es Client Component a propósito:
 * el `loader` es una función y no puede cruzar el límite RSC, así que vive acá.
 * MediaFrame (Server Component) la usa sin pasar funciones.
 */
export function CloudinaryImage({
  id,
  alt,
  sizes,
  priority,
  className,
}: {
  id: string;
  alt: string;
  sizes: string;
  priority: boolean;
  className?: string;
}) {
  return (
    <Image
      loader={cloudinaryLoader}
      src={id}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
