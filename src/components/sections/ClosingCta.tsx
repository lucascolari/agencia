import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";

/** Cierre editorial con CTA. Compartido por Home y About. */
export function ClosingCta({
  content,
  href = "/contact",
}: {
  content: { title: string; action: string };
  href?: string;
}) {
  return (
    <section className="py-[calc(var(--section-gap)*1.2)]">
      <Container>
        <Reveal>
          <h2 className="max-w-4xl font-display text-display text-text">
            {content.title}
          </h2>
          <div className="mt-12">
            <ButtonLink href={href}>{content.action}</ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
