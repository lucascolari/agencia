import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { MediaFrame } from "@/components/media/MediaFrame";
import type { AboutContent } from "@/types/content";

export function AboutCulture({
  content,
}: {
  content: AboutContent["culture"];
}) {
  return (
    <section className="py-[var(--section-gap)]">
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-label uppercase tracking-[0.28em] text-muted">
              {content.eyebrow}
            </p>
            <h2 className="mt-6 font-display text-heading text-text">
              {content.title}
            </h2>
            <p className="mt-8 max-w-md leading-relaxed text-secondary">
              {content.body}
            </p>
            <dl className="mt-12 grid grid-cols-3 gap-6">
              {content.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-4xl text-text">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 text-label uppercase tracking-[0.16em] text-muted">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <Reveal className="md:col-span-6 md:col-start-7">
            <div className="aspect-[4/5] w-full overflow-hidden">
              <MediaFrame
                media={{
                  kind: "placeholder",
                  alt: "El equipo en el estudio",
                  tone: "#26261f",
                  priority: "lazy",
                }}
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
