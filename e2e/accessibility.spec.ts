import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  { path: "/", name: "home" },
  { path: "/work", name: "work" },
  { path: "/work/nucleo-rebrand", name: "case study" },
  { path: "/about", name: "about" },
  { path: "/contact", name: "contact" },
];

test.describe("Accesibilidad (axe)", () => {
  for (const { path, name } of pages) {
    test(`${name} sin violaciones serias ni críticas`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      const summary = serious.map(
        (v) => `${v.id} (${v.impact}): ${v.nodes.length} nodo(s) — ${v.help}`,
      );
      expect(serious, summary.join("\n")).toEqual([]);
    });
  }
});
