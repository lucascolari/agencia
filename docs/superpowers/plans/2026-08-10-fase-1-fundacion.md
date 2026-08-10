# Fase 1 — Fundación, Design System y Navegación — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffolding Next.js + design tokens + design system base + layout global + navegación desktop/mobile — una web navegable con identidad base, sin errores de consola.

**Architecture:** Next.js App Router con Server Components por defecto; tokens de diseño como CSS variables (`src/styles/tokens.css`) mapeadas a utilidades Tailwind v4 vía `@theme inline`; todo el copy sale de la capa de contenido (`src/lib/content/ui.ts` + `src/config/site.ts`) con locale `es` — nada hardcodeado en componentes. Client Components solo: `NavLink`, `MobileMenu`, `SmoothScrollProvider`.

**Tech Stack:** Next.js (App Router) + React + TypeScript + Tailwind CSS v4 + `motion` (Framer Motion) + `lenis` + Vitest + React Testing Library.

## Global Constraints

- **Ruta del proyecto:** `C:\dev\agencia` (en Bash: `/c/dev/agencia`). NUNCA dentro de OneDrive.
- **Commits:** mensajes neutrales descriptivos en español. **PROHIBIDO** cualquier atribución de autoría (sin `Co-Authored-By`, sin firmas de personas ni herramientas). Identidad git local del repo ya configurada como `dev <dev@localhost>` — no cambiarla.
- **Copy/UI:** español (locale `es` default). Todo string visible viene de `src/lib/content/ui.ts` o `src/config/site.ts` — nunca hardcodeado en componentes.
- **Marca placeholder:** wordmark `AGENCIA` desde `siteConfig.name`; colores/tipos placeholder en tokens, swap-ready.
- **RSC por defecto:** `'use client'` SOLO en `NavLink`, `MobileMenu`, `SmoothScrollProvider`.
- **Dependencias permitidas en Fase 1:** `lenis`, `motion` (runtime); `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` (dev). **NO** instalar GSAP ni R3F todavía (entran en fases 2 y 5).
- **Dirección visual base (spec §6):** editorial oscuro — fondo casi negro, tipografía protagonista, whitespace, sin gradientes decorativos, sin glassmorphism, sin cards genéricas.
- **Spec:** `docs/superpowers/specs/2026-08-10-agencia-web-design.md`. **Vara de calidad:** `docs/referencias/master-prompt.md`.

---

### Task 1: Scaffolding Next.js + launch.json

**Files:**
- Create: proyecto Next.js completo en `C:\dev\agencia` (via create-next-app)
- Create: `.claude/launch.json`
- Modify: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css` (limpiar boilerplate)
- Delete: `public/*.svg` (assets demo de Vercel)

**Interfaces:**
- Produces: app Next.js con TS + Tailwind v4 + ESLint, alias `@/*` → `src/*`, `npm run dev` y `npm run build` funcionando.

- [ ] **Step 1: Scaffold**

```bash
cd /c/dev/agencia && npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

Expected: "Success!" — create-next-app acepta el directorio porque `.git`, `.gitignore` y `docs` están en su allowlist. Si pregunta por Turbopack, aceptar el default.

- [ ] **Step 2: Verificar versiones y build**

```bash
cd /c/dev/agencia && npm ls next tailwindcss && npm run build
```

Expected: next 15.x (o superior), tailwindcss 4.x, build "Compiled successfully". Si tailwindcss fuera 3.x, detenerse y avisar (el plan asume v4 CSS-first).

- [ ] **Step 3: Limpiar boilerplate**

Reemplazar `src/app/page.tsx` por:

```tsx
export default function HomePage() {
  return <div />;
}
```

Borrar los `.svg` demo de `public/`. En `src/app/layout.tsx` dejar la estructura default (se reescribe en Task 8). No tocar `globals.css` todavía (se reescribe en Task 3).

- [ ] **Step 4: Crear `.claude/launch.json`**

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "agencia",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 3000
    }
  ]
}
```

- [ ] **Step 5: Verificar que `npm run build` sigue pasando y commit**

```bash
cd /c/dev/agencia && npm run build && git add -A && git commit -m "feat: scaffolding Next.js con TypeScript y Tailwind"
```

---

### Task 2: Infraestructura de testing (Vitest + RTL)

**Files:**
- Create: `vitest.config.mts`, `vitest.setup.ts`, `src/lib/utils.test.ts`, `src/lib/utils.ts`
- Modify: `package.json` (script `test`)

**Interfaces:**
- Produces: `npm test` (vitest run); helper `cn(...classes: Array<string | false | null | undefined>): string` en `@/lib/utils`.

- [ ] **Step 1: Instalar dependencias**

```bash
cd /c/dev/agencia && npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Configurar Vitest**

`vitest.config.mts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

`vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";

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
```

En `package.json`, agregar a `"scripts"`: `"test": "vitest run"`.

- [ ] **Step 3: Test que falla para `cn`**

`src/lib/utils.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("une clases y descarta valores falsy", () => {
    expect(cn("a", false, "b", undefined, null, "c")).toBe("a b c");
  });
});
```

- [ ] **Step 4: Verificar que falla**

```bash
cd /c/dev/agencia && npm test
```

Expected: FAIL — `Cannot find module '@/lib/utils'` (o equivalente).

- [ ] **Step 5: Implementar `src/lib/utils.ts`**

```ts
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
```

- [ ] **Step 6: Verificar que pasa y commit**

```bash
cd /c/dev/agencia && npm test && git add -A && git commit -m "feat: infraestructura de testing con Vitest y RTL"
```

Expected: 1 passed.

---

### Task 3: Design tokens y estilos globales

**Files:**
- Create: `src/styles/tokens.css`
- Modify: `src/app/globals.css` (reescritura completa)

**Interfaces:**
- Produces: CSS vars globales (`--background`, `--surface`, `--primary`, `--secondary`, `--text`, `--muted`, `--accent`, `--border`, `--inverse`, `--duration-*`, `--ease-*`, `--z-*`, `--gutter`, `--section-gap`) y utilidades Tailwind `bg-background`, `text-text`, `text-muted`, `text-secondary`, `text-accent`, `border-border`, `font-display`, `font-body`, `text-display`, `text-heading`, `text-label`. Las fuentes esperan las vars `--font-archivo` y `--font-inter` (las setea Task 8).

- [ ] **Step 1: Crear `src/styles/tokens.css`**

```css
/* Design tokens — fuente única de la identidad. Marca placeholder: swap aquí. */
:root {
  /* Color (spec §6) */
  --background: #0c0c0c;
  --surface: #151513;
  --primary: #f2f0eb;
  --secondary: #b8b4ab;
  --text: #f2f0eb;
  --muted: #86827a;
  --accent: #e4ff3f;
  --border: rgba(242, 240, 235, 0.14);
  --inverse: #0c0c0c;

  /* Motion */
  --duration-fast: 200ms;
  --duration-normal: 400ms;
  --duration-slow: 700ms;
  --duration-cinematic: 1100ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-soft: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-cinematic: cubic-bezier(0.83, 0, 0.17, 1);

  /* Capas (spec §4) */
  --z-background: 0;
  --z-content: 10;
  --z-navigation: 40;
  --z-overlay: 50;
  --z-modal: 60;
  --z-cursor: 70;
  --z-loader: 80;

  /* Layout */
  --gutter: clamp(1.25rem, 4vw, 2.5rem);
  --section-gap: clamp(6rem, 14vh, 10rem);
}
```

- [ ] **Step 2: Reescribir `src/app/globals.css`**

```css
@import "tailwindcss";
@import "../styles/tokens.css";

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-text: var(--text);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-border: var(--border);
  --color-inverse: var(--inverse);

  --font-display: var(--font-archivo);
  --font-body: var(--font-inter);

  --text-display: clamp(3rem, 9vw, 8rem);
  --text-display--line-height: 0.95;
  --text-display--letter-spacing: -0.02em;
  --text-heading: clamp(2rem, 4.5vw, 3.75rem);
  --text-heading--line-height: 1.05;
  --text-label: 0.75rem;
}

body {
  background: var(--background);
  color: var(--text);
  font-family: var(--font-inter), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

::selection {
  background: var(--accent);
  color: var(--inverse);
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Build y commit**

```bash
cd /c/dev/agencia && npm run build && git add -A && git commit -m "feat: design tokens y estilos globales"
```

Expected: build OK.

---

### Task 4: Config del sitio y capa de contenido

**Files:**
- Create: `src/config/site.ts`, `src/types/content.ts`, `src/lib/content/ui.ts`
- Test: `src/lib/content/ui.test.ts`

**Interfaces:**
- Produces:
  - `siteConfig` (`@/config/site`): `{ name: string; tagline: string; description: string; locale: 'es'; location: string; email: string; social: { instagram: string; linkedin: string; whatsapp: string } }` + `type Locale = 'es'`
  - `getUiStrings(locale?: Locale): UiStrings` (`@/lib/content/ui`)
  - Tipos (`@/types/content`): `NavItem { label: string; href: string }`, `PageIntroContent { eyebrow: string; title: string; lead: string }`, `PageContent { meta: { title: string; description: string }; intro: PageIntroContent }`, `UiStrings { nav: NavItem[]; menu: { open: string; close: string }; footer: { rights: string }; pages: { home: { intro: PageIntroContent; cta: string }; about: PageContent; work: PageContent; contact: PageContent } }`

- [ ] **Step 1: Test que falla**

`src/lib/content/ui.test.ts`:

```ts
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
```

- [ ] **Step 2: Verificar que falla**

```bash
cd /c/dev/agencia && npm test
```

Expected: FAIL — módulo `@/lib/content/ui` inexistente.

- [ ] **Step 3: Implementar**

`src/types/content.ts`:

```ts
export interface NavItem {
  label: string;
  href: string;
}

export interface PageIntroContent {
  eyebrow: string;
  title: string;
  lead: string;
}

export interface PageContent {
  meta: { title: string; description: string };
  intro: PageIntroContent;
}

export interface UiStrings {
  nav: NavItem[];
  menu: { open: string; close: string };
  footer: { rights: string };
  pages: {
    home: { intro: PageIntroContent; cta: string };
    about: PageContent;
    work: PageContent;
    contact: PageContent;
  };
}
```

`src/config/site.ts` (todo placeholder swap-ready):

```ts
export const siteConfig = {
  name: "AGENCIA",
  tagline: "Soluciones digitales",
  description:
    "Estudio de soluciones digitales en Buenos Aires. Marcas, campañas y experiencias que dejan huella.",
  locale: "es",
  location: "Buenos Aires, Argentina",
  email: "hola@agencia.com",
  social: {
    instagram: "https://instagram.com/agencia",
    linkedin: "https://linkedin.com/company/agencia",
    whatsapp: "https://wa.me/5491100000000",
  },
} as const;

export type Locale = typeof siteConfig.locale;
```

`src/lib/content/ui.ts`:

```ts
import type { UiStrings } from "@/types/content";
import type { Locale } from "@/config/site";

const es: UiStrings = {
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Trabajos", href: "/work" },
    { label: "Nosotros", href: "/about" },
    { label: "Contacto", href: "/contact" },
  ],
  menu: { open: "Menú", close: "Cerrar" },
  footer: { rights: "Todos los derechos reservados" },
  pages: {
    home: {
      intro: {
        eyebrow: "Soluciones digitales — Buenos Aires",
        title: "Ideas que se sienten.",
        lead: "Creamos marcas, campañas y experiencias digitales para empresas que quieren jugar en primera.",
      },
      cta: "Hablemos",
    },
    about: {
      meta: {
        title: "Nosotros",
        description:
          "Quiénes somos, qué creemos y cómo trabajamos. Un estudio de soluciones digitales en Buenos Aires.",
      },
      intro: {
        eyebrow: "Nosotros",
        title: "Una obsesión: el detalle.",
        lead: "Pensamos cada proyecto como una pieza única. Estrategia, diseño y tecnología al servicio de la marca.",
      },
    },
    work: {
      meta: {
        title: "Trabajos",
        description:
          "Proyectos seleccionados: branding, campañas y experiencias digitales.",
      },
      intro: {
        eyebrow: "Trabajos",
        title: "Lo que hicimos habla por nosotros.",
        lead: "Una selección de proyectos que muestran cómo pensamos y cómo ejecutamos.",
      },
    },
    contact: {
      meta: {
        title: "Contacto",
        description:
          "Contanos tu proyecto. Estamos en Buenos Aires y trabajamos con clientes de todo el mundo.",
      },
      intro: {
        eyebrow: "Contacto",
        title: "Creemos algo juntos.",
        lead: "Contanos qué necesitás y te respondemos en el día.",
      },
    },
  },
};

const strings: Record<Locale, UiStrings> = { es };

export function getUiStrings(locale: Locale = "es"): UiStrings {
  return strings[locale];
}
```

- [ ] **Step 4: Verificar que pasa y commit**

```bash
cd /c/dev/agencia && npm test && git add -A && git commit -m "feat: config del sitio y capa de contenido es"
```

Expected: todos los tests PASS.

---

### Task 5: Primitivas UI — Container, ButtonLink, PageIntro

**Files:**
- Create: `src/components/ui/Container.tsx`, `src/components/ui/ButtonLink.tsx`, `src/components/sections/PageIntro.tsx`
- Test: `src/components/ui/ButtonLink.test.tsx`, `src/components/sections/PageIntro.test.tsx`

**Interfaces:**
- Consumes: `cn` (Task 2), `PageIntroContent` (Task 4).
- Produces:
  - `Container({ className?, children })` — wrapper `max-w` + gutter
  - `ButtonLink({ href, children, className? })` — CTA como link
  - `PageIntro({ content: PageIntroContent, children? })` — sección intro editorial; `children` se renderiza debajo del lead (para CTAs)

- [ ] **Step 1: Tests que fallan**

`src/components/ui/ButtonLink.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ButtonLink } from "@/components/ui/ButtonLink";

describe("ButtonLink", () => {
  it("renderiza un link con href y texto", () => {
    render(<ButtonLink href="/contact">Hablemos</ButtonLink>);
    const link = screen.getByRole("link", { name: "Hablemos" });
    expect(link).toHaveAttribute("href", "/contact");
  });
});
```

`src/components/sections/PageIntro.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageIntro } from "@/components/sections/PageIntro";

const content = {
  eyebrow: "Contacto",
  title: "Creemos algo juntos.",
  lead: "Contanos qué necesitás.",
};

describe("PageIntro", () => {
  it("renderiza eyebrow, título h1 y lead", () => {
    render(<PageIntro content={content} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Creemos algo juntos." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Contacto")).toBeInTheDocument();
    expect(screen.getByText("Contanos qué necesitás.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Verificar que fallan**

```bash
cd /c/dev/agencia && npm test
```

Expected: FAIL — módulos inexistentes.

- [ ] **Step 3: Implementar**

`src/components/ui/Container.tsx`:

```tsx
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[90rem] px-[var(--gutter)]", className)}
    >
      {children}
    </div>
  );
}
```

`src/components/ui/ButtonLink.tsx`:

```tsx
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ButtonLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-3 border border-border px-7 py-4",
        "text-label uppercase tracking-[0.22em] text-text",
        "transition-colors duration-[var(--duration-fast)]",
        "hover:border-accent hover:text-accent",
        className,
      )}
    >
      {children}
    </Link>
  );
}
```

`src/components/sections/PageIntro.tsx`:

```tsx
import { Container } from "@/components/ui/Container";
import type { PageIntroContent } from "@/types/content";

export function PageIntro({
  content,
  children,
}: {
  content: PageIntroContent;
  children?: React.ReactNode;
}) {
  return (
    <section className="pt-44 pb-28 md:pt-60 md:pb-36">
      <Container>
        <p className="text-label uppercase tracking-[0.28em] text-muted">
          {content.eyebrow}
        </p>
        <h1 className="mt-8 max-w-5xl font-display text-display text-text">
          {content.title}
        </h1>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-secondary">
          {content.lead}
        </p>
        {children ? <div className="mt-12">{children}</div> : null}
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Verificar que pasan y commit**

```bash
cd /c/dev/agencia && npm test && git add -A && git commit -m "feat: primitivas UI Container, ButtonLink y PageIntro"
```

---

### Task 6: NavLink + Header desktop

**Files:**
- Create: `src/components/navigation/NavLink.tsx`, `src/components/navigation/Header.tsx`
- Test: `src/components/navigation/NavLink.test.tsx`

**Interfaces:**
- Consumes: `cn`, `siteConfig`, `getUiStrings`, `Container`, `NavItem`.
- Produces:
  - `NavLink({ href, label, className?, onNavigate? })` — client; `aria-current="page"` cuando activo
  - `Header()` — server; usa `MobileMenu` de Task 7 (crear Header al final de Task 7 si se ejecuta fuera de orden; en orden normal, Header se crea aquí con el import y compila recién al existir MobileMenu — por eso este task NO corre build, solo tests de NavLink)

- [ ] **Step 1: Test que falla**

`src/components/navigation/NavLink.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavLink } from "@/components/navigation/NavLink";

vi.mock("next/navigation", () => ({
  usePathname: () => "/work",
}));

describe("NavLink", () => {
  it("marca aria-current cuando la ruta está activa", () => {
    render(<NavLink href="/work" label="Trabajos" />);
    expect(screen.getByRole("link", { name: "Trabajos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("no marca aria-current en rutas inactivas", () => {
    render(<NavLink href="/" label="Inicio" />);
    expect(screen.getByRole("link", { name: "Inicio" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
```

- [ ] **Step 2: Verificar que falla**

```bash
cd /c/dev/agencia && npx vitest run src/components/navigation
```

Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

`src/components/navigation/NavLink.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  label,
  className,
  onNavigate,
}: {
  href: string;
  label: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "transition-colors duration-[var(--duration-fast)]",
        active ? "text-text" : "text-muted hover:text-text",
        className,
      )}
    >
      {label}
    </Link>
  );
}
```

`src/components/navigation/Header.tsx`:

```tsx
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { Container } from "@/components/ui/Container";
import { NavLink } from "./NavLink";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const ui = getUiStrings(siteConfig.locale);

  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-navigation)]">
      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-[0.08em] text-text"
        >
          {siteConfig.name}
        </Link>
        <nav
          aria-label="Principal"
          className="hidden items-center gap-10 text-label uppercase tracking-[0.2em] md:flex"
        >
          {ui.nav.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <MobileMenu items={ui.nav} labels={ui.menu} brand={siteConfig.name} />
      </Container>
    </header>
  );
}
```

- [ ] **Step 4: Verificar tests de NavLink y commit**

```bash
cd /c/dev/agencia && npx vitest run src/components/navigation && git add -A && git commit -m "feat: NavLink con estado activo y Header"
```

Expected: NavLink PASS (Header compila como TSX pero aún importa MobileMenu inexistente — el typecheck completo llega en Task 7).

---

### Task 7: MobileMenu fullscreen

**Files:**
- Create: `src/components/navigation/MobileMenu.tsx`
- Test: `src/components/navigation/MobileMenu.test.tsx`

**Interfaces:**
- Consumes: `NavLink`, `NavItem`, paquete `motion`.
- Produces: `MobileMenu({ items: NavItem[]; labels: { open: string; close: string }; brand: string })` — client; overlay fullscreen con `role="dialog"`, cierra con Escape, con botón Cerrar y al navegar; bloquea scroll del body mientras está abierto.

- [ ] **Step 1: Instalar motion**

```bash
cd /c/dev/agencia && npm i motion
```

- [ ] **Step 2: Test que falla**

`src/components/navigation/MobileMenu.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileMenu } from "@/components/navigation/MobileMenu";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const props = {
  items: [
    { label: "Inicio", href: "/" },
    { label: "Contacto", href: "/contact" },
  ],
  labels: { open: "Menú", close: "Cerrar" },
  brand: "AGENCIA",
};

describe("MobileMenu", () => {
  it("abre el overlay y muestra la navegación", async () => {
    const user = userEvent.setup();
    render(<MobileMenu {...props} />);
    await user.click(screen.getByRole("button", { name: "Menú" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contacto" })).toBeInTheDocument();
  });

  it("cierra con el botón Cerrar", async () => {
    const user = userEvent.setup();
    render(<MobileMenu {...props} />);
    await user.click(screen.getByRole("button", { name: "Menú" }));
    await user.click(screen.getByRole("button", { name: "Cerrar" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("cierra con Escape", async () => {
    const user = userEvent.setup();
    render(<MobileMenu {...props} />);
    await user.click(screen.getByRole("button", { name: "Menú" }));
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });
});
```

- [ ] **Step 3: Verificar que falla**

```bash
cd /c/dev/agencia && npx vitest run src/components/navigation
```

Expected: FAIL — `MobileMenu` inexistente.

- [ ] **Step 4: Implementar**

`src/components/navigation/MobileMenu.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { NavItem } from "@/types/content";
import { NavLink } from "./NavLink";

interface MobileMenuProps {
  items: NavItem[];
  labels: { open: string; close: string };
  brand: string;
}

export function MobileMenu({ items, labels, brand }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-movil"
        onClick={() => setOpen(true)}
        className="text-label uppercase tracking-[0.22em] text-text"
      >
        {labels.open}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            role="dialog"
            aria-modal="true"
            aria-label={labels.open}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[var(--z-overlay)] flex flex-col bg-background px-[var(--gutter)]"
          >
            <div className="flex h-20 items-center justify-between">
              <span className="font-display text-lg font-semibold tracking-[0.08em] text-text">
                {brand}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-label uppercase tracking-[0.22em] text-text"
              >
                {labels.close}
              </button>
            </div>
            <nav
              aria-label="Principal"
              className="flex flex-1 flex-col justify-center gap-4"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.06 * index,
                    duration: 0.45,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <NavLink
                    {...item}
                    onNavigate={() => setOpen(false)}
                    className="font-display text-5xl tracking-tight"
                  />
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 5: Verificar tests + typecheck y commit**

```bash
cd /c/dev/agencia && npm test && npx tsc --noEmit && git add -A && git commit -m "feat: menu movil fullscreen con overlay animado"
```

Expected: todos PASS; typecheck limpio (Header ya compila).

---

### Task 8: Footer, SmoothScrollProvider y layout global

**Files:**
- Create: `src/components/navigation/Footer.tsx`, `src/providers/SmoothScrollProvider.tsx`
- Modify: `src/app/layout.tsx` (reescritura completa)
- Test: `src/providers/SmoothScrollProvider.test.tsx`

**Interfaces:**
- Consumes: `siteConfig`, `getUiStrings`, `Container`, `Header`, paquete `lenis`.
- Produces: `Footer()`, `SmoothScrollProvider({ children })` (client; no inicializa Lenis con reduced motion), layout raíz con fuentes Archivo/Inter (`--font-archivo`, `--font-inter`), `lang="es"`, Header/Footer globales y metadata base.

- [ ] **Step 1: Instalar lenis**

```bash
cd /c/dev/agencia && npm i lenis
```

- [ ] **Step 2: Test que falla**

`src/providers/SmoothScrollProvider.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";

const lenisConstructor = vi.fn().mockImplementation(() => ({
  raf: vi.fn(),
  destroy: vi.fn(),
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
```

- [ ] **Step 3: Verificar que falla**

```bash
cd /c/dev/agencia && npx vitest run src/providers
```

Expected: FAIL — módulo inexistente.

- [ ] **Step 4: Implementar**

`src/providers/SmoothScrollProvider.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const lenis = new Lenis({ lerp: 0.12 });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

`src/components/navigation/Footer.tsx`:

```tsx
import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const ui = getUiStrings(siteConfig.locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12">
      <Container className="flex flex-col gap-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>{siteConfig.location}</p>
        <nav
          aria-label="Redes"
          className="flex gap-8 text-label uppercase tracking-[0.2em]"
        >
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-[var(--duration-fast)] hover:text-text"
          >
            Instagram
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-[var(--duration-fast)] hover:text-text"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="transition-colors duration-[var(--duration-fast)] hover:text-text"
          >
            Email
          </a>
        </nav>
        <p>
          © {year} {siteConfig.name} — {ui.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
```

`src/app/layout.tsx` (reescritura completa):

```tsx
import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${archivo.variable} ${inter.variable}`}>
      <body>
        <SmoothScrollProvider>
          <Header />
          <main className="relative z-[var(--z-content)]">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verificar tests + build y commit**

```bash
cd /c/dev/agencia && npm test && npm run build && git add -A && git commit -m "feat: layout global con fuentes, smooth scroll y footer"
```

Expected: tests PASS, build OK.

---

### Task 9: Páginas stub con metadata

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/about/page.tsx`, `src/app/work/page.tsx`, `src/app/contact/page.tsx`

**Interfaces:**
- Consumes: `getUiStrings`, `siteConfig`, `PageIntro`, `ButtonLink`.
- Produces: las 4 rutas de V1 navegables con copy de la capa de contenido y metadata por página.

- [ ] **Step 1: Implementar las 4 páginas**

`src/app/page.tsx`:

```tsx
import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { PageIntro } from "@/components/sections/PageIntro";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function HomePage() {
  const ui = getUiStrings(siteConfig.locale);

  return (
    <PageIntro content={ui.pages.home.intro}>
      <ButtonLink href="/contact">{ui.pages.home.cta}</ButtonLink>
    </PageIntro>
  );
}
```

`src/app/about/page.tsx`:

```tsx
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { PageIntro } from "@/components/sections/PageIntro";

const page = getUiStrings(siteConfig.locale).pages.about;

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
};

export default function AboutPage() {
  return <PageIntro content={page.intro} />;
}
```

`src/app/work/page.tsx`:

```tsx
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { PageIntro } from "@/components/sections/PageIntro";

const page = getUiStrings(siteConfig.locale).pages.work;

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
};

export default function WorkPage() {
  return <PageIntro content={page.intro} />;
}
```

`src/app/contact/page.tsx`:

```tsx
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { PageIntro } from "@/components/sections/PageIntro";

const page = getUiStrings(siteConfig.locale).pages.contact;

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
};

export default function ContactPage() {
  return <PageIntro content={page.intro} />;
}
```

- [ ] **Step 2: Verificar tests + build y commit**

```bash
cd /c/dev/agencia && npm test && npm run build && git add -A && git commit -m "feat: paginas stub de V1 con metadata"
```

Expected: tests PASS; build lista las rutas `/`, `/about`, `/contact`, `/work` como estáticas.

---

### Task 10: Verificación en navegador y cierre de fase

**Files:**
- Modify: solo fixes que surjan de la verificación.

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: Fase 1 verificada — sin errores de consola, responsive OK, navegación por teclado OK.

- [ ] **Step 1: Levantar el dev server** con la configuración `agencia` de `.claude/launch.json` (preview del harness — nunca `npm run dev` por Bash).

- [ ] **Step 2: Revisar consola y network** — cero errores/warnings de React o hidratación en `/`, `/about`, `/work`, `/contact`.

- [ ] **Step 3: Responsive** — probar viewport desktop (1280) y mobile (375): en mobile el nav desktop desaparece y el botón Menú abre el overlay fullscreen; links navegan y cierran el menú.

- [ ] **Step 4: Teclado** — Tab recorre wordmark → nav → contenido → footer con focus visible (outline accent); en el menú móvil Escape cierra.

- [ ] **Step 5: Screenshot** desktop y mobile de `/` como evidencia para Lucas.

- [ ] **Step 6: Fixes** — si algo falla: diagnosticar, corregir, re-verificar (systematic-debugging si hay bugs no triviales).

- [ ] **Step 7: Commit final de fase**

```bash
cd /c/dev/agencia && npm test && npm run build && git add -A && git commit -m "chore: cierre de fase 1 verificada" --allow-empty
```

- [ ] **Step 8: Push a GitHub** — requiere que Lucas cree el repo privado `agencia` en su GitHub y pase la URL:

```bash
cd /c/dev/agencia && git remote add origin <URL-del-repo> && git push -u origin main
```

---

## Self-review del plan

- **Cobertura del spec (Fase 1):** scaffolding ✓ (T1), tokens color/tipo/motion/z-index/spacing ✓ (T3), fuentes placeholder via next/font ✓ (T8), capa de contenido i18n-ready ✓ (T4), primitivas UI ✓ (T5), nav desktop ✓ (T6), nav mobile fullscreen ✓ (T7), Lenis + reduced-motion ✓ (T8), rutas V1 ✓ (T9), verificación de cierre ✓ (T10). Storybook: diferido deliberadamente (spec lo lista como herramienta general; entra cuando el design system crezca — anti-overengineering §59).
- **Placeholders:** ninguno — todo step tiene código o comando concreto.
- **Consistencia de tipos:** `NavItem`/`PageIntroContent`/`PageContent`/`UiStrings` (T4) coinciden con los usos en T5-T9; `cn` (T2) usado en T5-T7; vars `--font-archivo`/`--font-inter` (T8) coinciden con el mapeo de T3.
