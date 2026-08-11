import { defineConfig, devices } from "@playwright/test";

/**
 * E2E contra el dev server local. Playwright levanta el server solo si no está
 * corriendo (reuseExistingServer). Un solo navegador (Chromium) para el smoke;
 * se puede ampliar a firefox/webkit cuando haga falta.
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "line" : "list",
  // El dev server compila rutas on-demand (lento la 1ª vez). En CI se corre
  // contra el build de producción, donde ya está todo compilado.
  expect: { timeout: 15_000 },
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    // Determinismo: sin loader largo ni animaciones que tapen controles.
    // De paso ejercita el camino reduced-motion que el spec exige testear.
    reducedMotion: "reduce",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    // En CI corre contra el build de producción (rutas ya compiladas, rápido y
    // representativo); en local reusa el dev server que ya esté levantado.
    command: process.env.CI ? "npm run start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
