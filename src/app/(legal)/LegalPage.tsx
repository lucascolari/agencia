import { Container } from "@/components/ui/Container";
import type { LegalPage as LegalPageContent } from "@/lib/content/legal";

/** Plantilla editorial compartida por privacidad, cookies y términos. */
export function LegalPageView({ page }: { page: LegalPageContent }) {
  return (
    <section className="pt-44 pb-[var(--section-gap)] md:pt-60">
      <Container>
        <p className="text-label uppercase tracking-[0.28em] text-muted">
          {page.eyebrow}
        </p>
        <h1 className="mt-8 max-w-4xl font-display text-heading text-text">
          {page.title}
        </h1>
        <p className="mt-6 text-label uppercase tracking-[0.2em] text-muted">
          {page.updated}
        </p>

        <div className="mt-16 max-w-2xl border-t border-border">
          {page.sections.map((section) => (
            <div key={section.heading} className="border-b border-border py-10">
              <h2 className="font-display text-2xl text-text">
                {section.heading}
              </h2>
              <p className="mt-4 leading-relaxed text-secondary">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
