import { test, expect } from "@playwright/test";

// Pre-aceptamos cookies para que el banner no tape los controles durante el test.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "agencia-consent",
      JSON.stringify({ necessary: true, analytics: true, marketing: true }),
    );
  });
});

test.describe("Navegación", () => {
  test("recorre las páginas principales desde el header", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Ideas que se sienten",
    );

    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Trabajos" }).click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Lo que hicimos",
    );

    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Nosotros" }).click();
    await expect(page).toHaveURL(/\/about$/);

    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Contacto" }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Creemos algo juntos",
    );
  });

  test("filtra trabajos por categoría y refleja la URL", async ({ page }) => {
    await page.goto("/work");
    await page.getByRole("button", { name: "Digital" }).click();
    await expect(page).toHaveURL(/cat=digital/);
    // Los proyectos digitales enlazan a sus case studies.
    await expect(page.getByRole("link", { name: /Mercado Andino/ })).toBeVisible();
  });

  test("abre un case study desde work", async ({ page }) => {
    await page.goto("/work");
    await page.locator('a[href="/work/nucleo-rebrand"]').first().click();
    await expect(page).toHaveURL(/\/work\/nucleo-rebrand$/);
    await expect(page.getByText("Siguiente proyecto")).toBeVisible();
  });
});
