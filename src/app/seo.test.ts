import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { getProjects } from "@/lib/content/projects";

describe("sitemap", () => {
  it("incluye las rutas estáticas y todos los case studies", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith("/work"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/about"))).toBe(true);
    for (const project of getProjects()) {
      expect(urls.some((u) => u.endsWith(`/work/${project.slug}`))).toBe(true);
    }
  });

  it("la home tiene prioridad 1", () => {
    const home = sitemap().find((e) => !e.url.match(/\/(work|about|contact)/));
    expect(home?.priority).toBe(1);
  });
});

describe("robots", () => {
  it("bloquea /api y declara el sitemap", () => {
    const r = robots();
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(rule?.disallow).toContain("/api/");
    expect(r.sitemap).toMatch(/sitemap\.xml$/);
  });
});
