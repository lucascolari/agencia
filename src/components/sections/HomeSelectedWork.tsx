import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { getFeaturedProjects } from "@/lib/content/projects";
import type { HomeContent } from "@/types/content";

export function HomeSelectedWork({
  content,
}: {
  content: HomeContent["selectedWork"];
}) {
  const projects = getFeaturedProjects().slice(0, 4);

  return (
    <section className="py-[var(--section-gap)]">
      <Container>
        <div className="flex flex-col gap-6 border-t border-border pt-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-label uppercase tracking-[0.28em] text-muted">
              {content.eyebrow}
            </p>
            <h2 className="mt-6 max-w-2xl font-display text-heading text-text">
              {content.title}
            </h2>
          </div>
          <Link
            href="/work"
            className="text-label uppercase tracking-[0.22em] text-muted transition-colors duration-[var(--duration-fast)] hover:text-accent"
          >
            {content.viewAll}
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-20 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal
              key={project.slug}
              delay={(i % 2) * 0.08}
              className={i % 2 === 1 ? "md:mt-24" : ""}
            >
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
