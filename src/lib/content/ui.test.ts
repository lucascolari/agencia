import { describe, it, expect } from "vitest";
import { getUiStrings } from "@/lib/content/ui";

describe("getUiStrings", () => {
  it("devuelve la navegación completa en es", () => {
    const ui = getUiStrings("es");
    expect(ui.nav.map((n) => n.href)).toEqual([
      "/",
      "/work",
      "/about",
      "/contact",
    ]);
  });

  it("usa es como locale por defecto", () => {
    expect(getUiStrings().pages.contact.intro.title).toBeTruthy();
  });
});
