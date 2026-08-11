import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { HomeContent } from "@/types/content";

export function HomeCapabilities({
  content,
}: {
  content: HomeContent["capabilities"];
}) {
  return (
    <section className="py-[var(--section-gap)]">
      <Container>
        <div className="border-t border-border pt-10">
          <p className="text-label uppercase tracking-[0.28em] text-muted">
            {content.eyebrow}
          </p>
          <h2 className="mt-6 max-w-3xl font-display text-heading text-text">
            {content.title}
          </h2>
        </div>

        <ul className="mt-16">
          {content.items.map((item, i) => (
            <Reveal key={item.title}>
              <li className="grid grid-cols-1 gap-4 border-t border-border py-10 md:grid-cols-[6rem_1fr_1fr] md:gap-10">
                <span className="text-label uppercase tracking-[0.2em] text-muted tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-3xl text-text md:text-4xl">
                  {item.title}
                </h3>
                <p className="max-w-md text-secondary leading-relaxed">
                  {item.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
