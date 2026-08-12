import { describe, it, expect } from "vitest";
import { buildCloudinaryUrl } from "@/lib/media/cloudinary";

describe("buildCloudinaryUrl", () => {
  it("arma la URL con formato y calidad automáticos y ancho", () => {
    const url = buildCloudinaryUrl("demo", "proyectos/nucleo/hero", 1280);
    expect(url).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,c_limit,w_1280/proyectos/nucleo/hero",
    );
  });

  it("acepta una calidad explícita", () => {
    const url = buildCloudinaryUrl("demo", "foo", 800, 70);
    expect(url).toContain("q_70");
    expect(url).toContain("w_800");
  });
});
