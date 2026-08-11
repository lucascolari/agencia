import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center pt-32">
      <Container>
        <p className="text-label uppercase tracking-[0.28em] text-muted">
          Error 404
        </p>
        <h1 className="mt-8 max-w-3xl font-display text-display text-text">
          Esta página se nos escapó.
        </h1>
        <p className="mt-10 max-w-md text-lg leading-relaxed text-secondary">
          El enlace no existe o cambió de lugar. Volvé al inicio y seguimos.
        </p>
        <div className="mt-12">
          <ButtonLink href="/">Volver al inicio</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
