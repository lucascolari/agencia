/**
 * Resolución de imágenes con Cloudinary. La capa de media (`MediaFrame`) usa
 * esto para servir AVIF/WebP responsive desde el CDN. El Cloud name es público
 * (va en NEXT_PUBLIC_*), no es un secreto.
 */

export const cloudinaryCloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

export const hasCloudinary = cloudinaryCloudName.length > 0;

/**
 * Construye una URL de entrega de Cloudinary con formato y calidad automáticos
 * (`f_auto`, `q_auto`) y ancho fijo (`c_limit,w_`). Función pura y testeable.
 */
export function buildCloudinaryUrl(
  cloud: string,
  publicId: string,
  width: number,
  quality: number | "auto" = "auto",
): string {
  const transform = ["f_auto", `q_${quality}`, "c_limit", `w_${width}`].join(
    ",",
  );
  return `https://res.cloudinary.com/${cloud}/image/upload/${transform}/${publicId}`;
}

/** Loader para next/image: genera el srcset responsive vía Cloudinary. */
export function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  return buildCloudinaryUrl(cloudinaryCloudName, src, width, quality ?? "auto");
}
