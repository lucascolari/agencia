import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { AboutContent } from "@/types/content";

export function AboutBeliefs({
  content,
}: {
  content: AboutContent["beliefs"];
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

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
          {content.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 0.06}>
              <div className="flex gap-6">
                <span className="text-label uppercase tracking-[0.2em] text-muted tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl text-text md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-md leading-relaxed text-secondary">
                    {item.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
