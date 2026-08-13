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
    expect(getProjectBySlug("envision")?.client).toBe("Envision");
    expect(getProjectBySlug("no-existe")).toBeUndefined();
  });

  it("cada proyecto tiene case study con servicios y créditos", () => {
    for (const p of getProjects()) {
      expect(p.caseStudy.credits.length).toBeGreaterThan(0);
      expect(p.caseStudy.services.length).toBeGreaterThan(0);
    }
  });

  it("lista solo categorías usadas, en orden canónico", () => {
    const cats = getUsedCategories();
    expect(cats).toContain("produccion");
    expect(cats).toContain("campanas");
    // campanas va antes que produccion en el orden canónico.
    expect(cats.indexOf("campanas")).toBeLessThan(cats.indexOf("produccion"));
  });

  it("filtra por categoría y sin categoría devuelve todos", () => {
    expect(filterProjects(null).length).toBe(getProjects().length);
    const produccion = filterProjects("produccion");
    expect(produccion.length).toBeGreaterThan(0);
    expect(produccion.every((p) => p.categories.includes("produccion"))).toBe(
      true,
    );
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
