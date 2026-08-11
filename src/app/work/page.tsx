import type { Metadata } from "next";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { Container } from "@/components/ui/Container";
import { WorkFilter } from "@/features/work/WorkFilter";
import { WorkGrid } from "@/features/work/WorkGrid";
import {
  getUsedCategories,
  isProjectCategory,
} from "@/lib/content/projects";
import type { ProjectCategory } from "@/types/content";

const page = getUiStrings(siteConfig.locale).pages.work;

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
};

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const category: ProjectCategory | null =
    cat && isProjectCategory(cat) ? cat : null;

  return (
    <section className="pt-44 pb-32 md:pt-60">
      <Container>
        <p className="text-label uppercase tracking-[0.28em] text-muted">
          {page.intro.eyebrow}
        </p>
        <h1 className="mt-8 max-w-4xl font-display text-display text-text">
          {page.intro.title}
        </h1>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-secondary">
          {page.intro.lead}
        </p>

        <div className="mt-16 border-t border-border pt-8">
          <Suspense fallback={null}>
            <WorkFilter
              categories={getUsedCategories()}
              allLabel="Todos"
            />
          </Suspense>
        </div>

        <div className="mt-16">
          <WorkGrid
            category={category}
            emptyLabel="No hay proyectos en esta categoría todavía."
          />
        </div>
      </Container>
    </section>
  );
}
