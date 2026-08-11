import { describe, it, expect } from "vitest";
import {
  getProjects,
  getFeaturedProjects,
  getProjectBySlug,
} from "@/lib/content/projects";

describe("projects", () => {
  it("tiene slugs únicos", () => {
    const slugs = getProjects().map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("devuelve proyectos destacados para la home", () => {
    const featured = getFeaturedProjects();
    expect(featured.length).toBeGreaterThanOrEqual(3);
    expect(featured.every((p) => p.featured)).toBe(true);
  });

  it("encuentra un proyecto por slug", () => {
    expect(getProjectBySlug("nucleo-rebrand")?.client).toBe("Núcleo");
    expect(getProjectBySlug("no-existe")).toBeUndefined();
  });
});
