import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  { path: "/", name: "home" },
  { path: "/work", name: "work" },
  { path: "/work/nucleo-rebrand", name: "case study" },
  { path: "/about", name: "about" },
  { path: "/contact", name: "contact" },
];

// El loader es un overlay decorativo (aria-hidden) de primera visita: lo marcamos
// como visto para escanear el contenido asentado, sin su fade transitorio.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem("loader-seen", "1");
  });
});

test.describe("Accesibilidad (axe)", () => {
  for (const { path, name } of pages) {
    test(`${name} sin violaciones serias ni críticas`, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      // Con la fuente y el layout ya asentados, medimos colores reales.
      await page.getByRole("heading", { level: 1 }).waitFor();
      // Margen para que terminen la detección de capacidades y cualquier
      // aparición diferida (banner de consentimiento) antes de medir.
      await page.waitForTimeout(500);
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
