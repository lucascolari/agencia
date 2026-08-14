import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

// next-view-transitions importa next/link, que Vitest no resuelve desde
// node_modules. En tests lo mockeamos con un <a> simple y un router noop.
vi.mock("next-view-transitions", () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string | { toString(): string };
    children: React.ReactNode;
  }) =>
    React.createElement(
      "a",
      { href: typeof href === "string" ? href : String(href), ...props },
      children,
    ),
  useTransitionRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  ViewTransitions: ({ children }: { children: React.ReactNode }) => children,
}));

// jsdom no implementa IntersectionObserver; Framer Motion whileInView lo usa.
// El stub reporta el elemento como visible al observar, para que los reveals
// muestren su contenido en los tests.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [];
  constructor(private cb: IntersectionObserverCallback) {}
  observe(target: Element) {
    this.cb(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this,
    );
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});
Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

// jsdom no implementa matchMedia; varios componentes lo consultan.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});
