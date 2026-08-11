import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

describe("useDeviceCapability", () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    // WebGL disponible por defecto en el stub.
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({}) as never);
    Object.defineProperty(window, "WebGLRenderingContext", {
      configurable: true,
      value: function () {},
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it("permite 3D en un dispositivo capaz sin reduced-motion", async () => {
    window.matchMedia = ((q: string) => ({
      matches: false,
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useDeviceCapability());
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.allow3D).toBe(true);
  });

  it("desactiva 3D con prefers-reduced-motion", async () => {
    window.matchMedia = ((q: string) => ({
      matches: q.includes("reduced-motion"),
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useDeviceCapability());
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.reducedMotion).toBe(true);
    expect(result.current.allow3D).toBe(false);
  });
});
