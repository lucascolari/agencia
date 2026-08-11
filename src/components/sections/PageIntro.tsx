import { Container } from "@/components/ui/Container";
import type { PageIntroContent } from "@/types/content";

export function PageIntro({
  content,
  children,
}: {
  content: PageIntroContent;
  children?: React.ReactNode;
}) {
  return (
    <section className="pt-44 pb-28 md:pt-60 md:pb-36">
      <Container>
        <p className="text-label uppercase tracking-[0.28em] text-muted">
          {content.eyebrow}
        </p>
        <h1 className="mt-8 max-w-5xl font-display text-display text-text">
          {content.title}
        </h1>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-secondary">
          {content.lead}
        </p>
        {children ? <div className="mt-12">{children}</div> : null}
      </Container>
    </section>
  );
}
