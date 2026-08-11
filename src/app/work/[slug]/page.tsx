import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig, siteUrl } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/media/MediaFrame";
import { CaseStudyBlocks } from "@/components/sections/CaseStudyBlocks";
import { Reveal } from "@/components/motion/Reveal";
import {
  getProjects,
  getProjectBySlug,
  getNextProject,
  CATEGORY_LABELS,
} from "@/lib/content/projects";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const url = `/work/${project.slug}`;
  return {
    title: `${project.title} — ${project.client}`,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${project.title} — ${project.client}`,
      description: project.summary,
      url,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const next = getNextProject(project.slug);
  const { caseStudy } = project;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    about: caseStudy.challenge,
    creator: { "@type": "Organization", name: siteConfig.name },
    dateCreated: String(project.year),
    url: `${siteUrl}/work/${project.slug}`,
  };

  return (
    <article className="pb-[var(--section-gap)] pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <Container>
        <p className="text-label uppercase tracking-[0.24em] text-muted">
          {project.client} — {project.year}
        </p>
        <h1 className="mt-8 max-w-5xl font-display text-display text-text">
          {project.title}
        </h1>
        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-secondary">
          {project.summary}
        </p>
      </Container>

      <div className="mt-16 aspect-[16/9] w-full overflow-hidden">
        <MediaFrame media={project.cover} />
      </div>

      {/* Ficha: servicios + desafío + estrategia */}
      <Container>
        <div className="mt-20 grid grid-cols-1 gap-12 border-t border-border pt-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="text-label uppercase tracking-[0.2em] text-muted">
              Servicios
            </h2>
            <ul className="mt-6 space-y-2 text-secondary">
              {caseStudy.services.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <h2 className="mt-12 text-label uppercase tracking-[0.2em] text-muted">
              Disciplinas
            </h2>
            <p className="mt-6 text-secondary">
              {project.categories.map((c) => CATEGORY_LABELS[c]).join(", ")}
            </p>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <h2 className="text-label uppercase tracking-[0.2em] text-muted">
              El desafío
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-text">
              {caseStudy.challenge}
            </p>
            <h2 className="mt-12 text-label uppercase tracking-[0.2em] text-muted">
              La estrategia
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-text">
              {caseStudy.strategy}
            </p>
          </div>
        </div>
      </Container>

      {/* Bloques modulares */}
      <div className="mt-[var(--section-gap)]">
        <CaseStudyBlocks blocks={caseStudy.blocks} />
      </div>

      {/* Créditos */}
      <Container>
        <div className="mt-[var(--section-gap)] border-t border-border pt-16">
          <h2 className="text-label uppercase tracking-[0.2em] text-muted">
            Créditos
          </h2>
          <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
            {caseStudy.credits.map((credit) => (
              <div key={credit.role} className="flex flex-col gap-1">
                <dt className="text-label uppercase tracking-[0.2em] text-muted">
                  {credit.role}
                </dt>
                <dd className="text-text">{credit.name}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>

      {/* Next project */}
      <Reveal>
        <Link
          href={`/work/${next.slug}`}
          className="group mt-[var(--section-gap)] block border-t border-border py-16"
        >
          <Container>
            <span className="text-label uppercase tracking-[0.2em] text-muted">
              Siguiente proyecto
            </span>
            <h2 className="mt-6 font-display text-heading text-text transition-colors duration-[var(--duration-fast)] group-hover:text-accent">
              {next.title}
            </h2>
            <span className="mt-4 block text-label uppercase tracking-[0.2em] text-muted">
              {next.client}
            </span>
          </Container>
        </Link>
      </Reveal>

      {/* Continuidad con la marca (spec §24) */}
      <Container>
        <p className="mt-20 text-label uppercase tracking-[0.2em] text-muted">
          {siteConfig.location}
        </p>
      </Container>
    </article>
  );
}
