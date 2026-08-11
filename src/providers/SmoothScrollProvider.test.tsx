import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";

const { lenisConstructor } = vi.hoisted(() => ({
  lenisConstructor: vi.fn(function () {
    return { raf: vi.fn(), destroy: vi.fn() };
  }),
}));

vi.mock("lenis", () => ({ default: lenisConstructor }));

describe("SmoothScrollProvider", () => {
  beforeEach(() => lenisConstructor.mockClear());

  it("renderiza a sus hijos e inicializa Lenis", () => {
    render(
      <SmoothScrollProvider>
        <p>contenido</p>
      </SmoothScrollProvider>,
    );
    expect(screen.getByText("contenido")).toBeInTheDocument();
    expect(lenisConstructor).toHaveBeenCalledOnce();
  });

  it("no inicializa Lenis con prefers-reduced-motion", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      ...original(query),
      matches: true,
    })) as typeof window.matchMedia;
    render(
      <SmoothScrollProvider>
        <p>contenido</p>
      </SmoothScrollProvider>,
    );
    expect(lenisConstructor).not.toHaveBeenCalled();
    window.matchMedia = original;
  });
});
