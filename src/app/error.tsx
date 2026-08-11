"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";

/**
 * Boundary de error global. Reemplaza la pantalla blanca de un fallo de runtime
 * por una página con la identidad del sitio y opción de reintentar.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // En fase 7 (Sentry) esto reporta el error al servicio de observabilidad.
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70svh] items-center pt-32">
      <Container>
        <p className="text-label uppercase tracking-[0.28em] text-muted">
          Algo salió mal
        </p>
        <h1 className="mt-8 max-w-3xl font-display text-heading text-text">
          Tuvimos un problema inesperado.
        </h1>
        <p className="mt-10 max-w-md text-lg leading-relaxed text-secondary">
          Ya lo estamos mirando. Podés reintentar o volver más tarde.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-12 inline-flex items-center gap-3 border border-border px-7 py-4 text-label uppercase tracking-[0.22em] text-text transition-colors duration-[var(--duration-fast)] hover:border-accent hover:text-accent"
        >
          Reintentar
        </button>
      </Container>
    </section>
  );
}
