import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { HomeContent } from "@/types/content";

export function HomeClosing({
  content,
}: {
  content: HomeContent["closing"];
}) {
  return (
    <section className="py-[calc(var(--section-gap)*1.2)]">
      <Container>
        <Reveal>
          <h2 className="max-w-4xl font-display text-display text-text">
            {content.title}
          </h2>
          <div className="mt-12">
            <ButtonLink href="/contact">{content.action}</ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
