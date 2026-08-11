import { describe, it, expect } from "vitest";
import {
  getProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getUsedCategories,
  filterProjects,
  getNextProject,
  isProjectCategory,
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

  it("cada proyecto tiene un case study con bloques y créditos", () => {
    for (const p of getProjects()) {
      expect(p.caseStudy.blocks.length).toBeGreaterThan(0);
      expect(p.caseStudy.credits.length).toBeGreaterThan(0);
      expect(p.caseStudy.services.length).toBeGreaterThan(0);
    }
  });

  it("lista solo categorías usadas, en orden canónico", () => {
    const cats = getUsedCategories();
    expect(cats).toContain("branding");
    expect(cats.indexOf("branding")).toBeLessThan(cats.indexOf("digital"));
  });

  it("filtra por categoría y sin categoría devuelve todos", () => {
    expect(filterProjects(null).length).toBe(getProjects().length);
    const branding = filterProjects("branding");
    expect(branding.length).toBeGreaterThan(0);
    expect(branding.every((p) => p.categories.includes("branding"))).toBe(true);
  });

  it("devuelve el siguiente proyecto de forma circular", () => {
    const all = getProjects();
    const last = all[all.length - 1];
    expect(getNextProject(last.slug).slug).toBe(all[0].slug);
  });

  it("valida strings de categoría", () => {
    expect(isProjectCategory("branding")).toBe(true);
    expect(isProjectCategory("inventada")).toBe(false);
  });
});
