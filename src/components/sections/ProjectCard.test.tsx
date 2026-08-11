import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { getFeaturedProjects } from "@/lib/content/projects";

describe("ProjectCard", () => {
  it("enlaza al case study del proyecto", () => {
    const project = getFeaturedProjects()[0];
    render(<ProjectCard project={project} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/work/${project.slug}`);
    expect(
      screen.getByRole("heading", { name: project.title }),
    ).toBeInTheDocument();
  });
});
