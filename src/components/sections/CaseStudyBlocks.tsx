import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/media/MediaFrame";
import { Reveal } from "@/components/motion/Reveal";
import type { CaseStudyBlock } from "@/types/content";

/** Render de los bloques modulares de un case study (spec §20). */
export function CaseStudyBlocks({ blocks }: { blocks: CaseStudyBlock[] }) {
  return (
    <div className="flex flex-col gap-[var(--section-gap)]">
      {blocks.map((block, i) => (
        <Reveal key={i}>{renderBlock(block)}</Reveal>
      ))}
    </div>
  );
}

function renderBlock(block: CaseStudyBlock) {
  switch (block.type) {
    case "text":
      return (
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <h2 className="font-display text-heading text-text md:col-span-5">
              {block.heading}
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-secondary md:col-span-6 md:col-start-7">
              {block.body}
            </p>
          </div>
        </Container>
      );

    case "media":
      return (
        <figure className="w-full">
          <div className="aspect-[16/9] w-full overflow-hidden">
            <MediaFrame media={block.media} />
          </div>
          {block.caption ? (
            <Container>
              <figcaption className="mt-4 text-label uppercase tracking-[0.2em] text-muted">
                {block.caption}
              </figcaption>
            </Container>
          ) : null}
        </figure>
      );

    case "gallery":
      return (
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {block.items.map((item, i) => (
              <div key={i} className="aspect-[3/4] overflow-hidden">
                <MediaFrame media={item} />
              </div>
            ))}
          </div>
        </Container>
      );

    case "quote":
      return (
        <Container>
          <blockquote className="mx-auto max-w-4xl text-center">
            <p className="font-display text-heading text-text">
              “{block.quote}”
            </p>
            <footer className="mt-8 text-label uppercase tracking-[0.2em] text-muted">
              {block.author}
            </footer>
          </blockquote>
        </Container>
      );

    case "metrics":
      return (
        <Container>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-12 border-t border-border pt-12 sm:grid-cols-3">
            {block.items.map((item, i) => (
              <div key={i}>
                <dt className="font-display text-display text-text">
                  {item.value}
                </dt>
                <dd className="mt-3 text-label uppercase tracking-[0.2em] text-muted">
                  {item.label}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      );
  }
}
