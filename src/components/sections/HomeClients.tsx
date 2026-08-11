import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { HomeContent } from "@/types/content";

export function HomeClients({
  content,
}: {
  content: HomeContent["clients"];
}) {
  return (
    <section className="py-[var(--section-gap)]">
      <Container>
        <div className="border-t border-border pt-10">
          <p className="text-label uppercase tracking-[0.28em] text-muted">
            {content.eyebrow}
          </p>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {content.names.map((name) => (
            <Reveal key={name}>
              <li className="font-display text-xl text-secondary md:text-2xl">
                {name}
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
