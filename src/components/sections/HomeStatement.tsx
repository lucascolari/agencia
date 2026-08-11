import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { HomeContent } from "@/types/content";

export function HomeStatement({
  content,
}: {
  content: HomeContent["statement"];
}) {
  return (
    <section className="py-[var(--section-gap)]">
      <Container>
        <p className="text-label uppercase tracking-[0.28em] text-muted">
          {content.eyebrow}
        </p>
        <div className="mt-12 max-w-5xl font-display text-heading text-text">
          {content.lines.map((line, i) => (
            <Reveal key={line} delay={i * 0.05}>
              <p className={i === content.lines.length - 1 ? "text-muted" : ""}>
                {line}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
