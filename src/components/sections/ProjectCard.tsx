import { Link } from "next-view-transitions";
import { MediaFrame } from "@/components/media/MediaFrame";
import { CATEGORY_LABELS } from "@/lib/content/projects";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/content";

const ASPECT: Record<Project["layout"], string> = {
  full: "aspect-[16/9]",
  split: "aspect-[4/5]",
  tall: "aspect-[3/4]",
};

export function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn("group block", className)}
    >
      <div
        className={cn("relative overflow-hidden", ASPECT[project.layout])}
        style={{ viewTransitionName: `cover-${project.slug}` }}
      >
        <div className="h-full w-full transition-transform duration-[var(--duration-slow)] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
          <MediaFrame media={project.cover} />
        </div>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-6">
        <h3 className="font-display text-2xl text-text md:text-3xl">
          {project.title}
        </h3>
        <span className="shrink-0 text-label uppercase tracking-[0.2em] text-muted">
          {project.year}
        </span>
      </div>
      <p className="mt-2 text-label uppercase tracking-[0.2em] text-muted">
        {project.client} —{" "}
        {project.categories.map((c) => CATEGORY_LABELS[c]).join(", ")}
      </p>
    </Link>
  );
}
