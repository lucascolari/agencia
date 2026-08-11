import { ProjectCard } from "@/components/sections/ProjectCard";
import { Reveal } from "@/components/motion/Reveal";
import { filterProjects } from "@/lib/content/projects";
import type { ProjectCategory } from "@/types/content";

/**
 * Portfolio editorial: NO es una grilla uniforme. El layout de cada proyecto
 * (full / split / tall) viene del contenido y crea un ritmo asimétrico.
 */
export function WorkGrid({
  category,
  emptyLabel,
}: {
  category: ProjectCategory | null;
  emptyLabel: string;
}) {
  const projects = filterProjects(category);

  if (projects.length === 0) {
    return <p className="py-20 text-secondary">{emptyLabel}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-24 md:grid-cols-12">
      {projects.map((project, i) => {
        const span =
          project.layout === "full"
            ? "md:col-span-12"
            : project.layout === "tall"
              ? "md:col-span-5"
              : "md:col-span-7";
        const offset =
          project.layout === "tall" && i % 2 === 1 ? "md:col-start-8" : "";
        return (
          <Reveal
            key={project.slug}
            className={`${span} ${offset}`}
            delay={(i % 2) * 0.06}
          >
            <ProjectCard project={project} />
          </Reveal>
        );
      })}
    </div>
  );
}
