import { Container } from "@/components/ui/Container";

/** Estado de carga a nivel ruta. Sobrio, alineado a la identidad. */
export default function Loading() {
  return (
    <section className="flex min-h-[70svh] items-center pt-32" aria-busy="true">
      <Container>
        <span className="text-label uppercase tracking-[0.28em] text-muted">
          Cargando…
        </span>
      </Container>
    </section>
  );
}
