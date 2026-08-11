import { test, expect } from "@playwright/test";

// Pre-aceptamos cookies para que el banner no tape el formulario.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "agencia-consent",
      JSON.stringify({ necessary: true, analytics: true, marketing: true }),
    );
  });
});

test.describe("Formulario de contacto", () => {
  test("completa los 4 pasos y muestra el éxito", async ({ page }) => {
    await page.goto("/contact");

    // Paso 1: tipo de proyecto
    await page.getByRole("button", { name: "Branding", exact: true }).click();
    await page.getByRole("button", { name: "Siguiente" }).click();

    // Paso 2: descripción
    await page
      .getByLabel("Contanos un poco más")
      .fill("Necesitamos rebranding completo.");
    await page.getByRole("button", { name: "Siguiente" }).click();

    // Paso 3: datos
    await page.getByLabel("Nombre").fill("Lucas");
    await page.getByLabel("Email").fill("lucas@agencia.com");
    await page.getByRole("button", { name: "Siguiente" }).click();

    // Paso 4: presupuesto + enviar
    await page.getByRole("button", { name: "Todavía no lo sé" }).click();
    await page.getByRole("button", { name: "Enviar" }).click();

    await expect(page.getByText("Recibimos tu mensaje")).toBeVisible();
  });

  test("no deja avanzar sin elegir tipo de proyecto", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Siguiente" }).click();
    await expect(page.getByText("Este campo es obligatorio.")).toBeVisible();
  });
});
