# Spec de diseño — Web de agencia digital

**Fecha:** 2026-08-10
**Estado:** Aprobado por Lucas (diseño conversacional) — pendiente revisión de este documento
**Proyecto:** `C:\dev\agencia` (fuera de OneDrive; GitHub será la fuente de la verdad)

---

## 1. Objetivo

Construir una web de agencia digital multi-página, lista para producción, capaz de competir
visual, experiencial y técnicamente con las mejores webs de agencias del mundo.

**Referencias de nivel de ambición** (no copiar; crear identidad propia):

- https://www.gut.agency/
- https://donzeta.com/

El detalle completo de requisitos y criterios de calidad está en el **master prompt** del
proyecto: [`docs/referencias/master-prompt.md`](../../referencias/master-prompt.md). Ese
documento es la vara de calidad de todas las fases. Este spec fija las decisiones de
arquitectura y el orden de construcción.

**Cliente:** agencia de soluciones digitales, Buenos Aires, Argentina. El nombre, logo,
paleta y tipografías definitivas los entrega el diseñador gráfico del cliente más adelante;
mientras tanto se trabaja con **marca placeholder sobre design tokens** (ver §6).

---

## 2. Decisiones aprobadas

| Decisión | Elección | Motivo |
|---|---|---|
| Ubicación | `C:\dev\agencia`, fuera de OneDrive | `node_modules` (decenas de miles de archivos) rompe/enlentece la sincronización de OneDrive. GitHub sigue siendo la fuente de la verdad. |
| Enfoque | Construcción por fases (§13) | Mismo resultado final que el master prompt; cada fase produce algo visible y verificable. Sigue la sección 61 del master prompt. |
| Marca | Placeholder sobre tokens | Cuando llegue la marca real se actualiza un solo archivo de tokens. |
| Media | Archivos locales primero; Cloudinary/Mux en fase 6 | Evita bloquear el desarrollo esperando cuentas/credenciales. La capa de media queda abstraída desde el día 1. |
| Idiomas | Español primero; arquitectura i18n-ready | Rutas y contenido preparados para agregar idiomas sin reescribir (sección 27 del master prompt). |
| CMS | Sanity en fase 6; arquitectura CMS-ready desde el día 1 | Los componentes consumen datos tipados desde una capa de contenido; hoy la alimenta contenido local, mañana Sanity. |

---

## 3. Stack

- **Frontend:** Next.js (App Router) + React + TypeScript
- **Estilos:** Tailwind CSS + CSS variables + design tokens
- **Animación:** GSAP + ScrollTrigger (storytelling de scroll, timelines, escenas pinneadas), Framer Motion (UI: menús, modales, transiciones de página, layout), Lenis (smooth scroll)
- **3D:** Three.js + React Three Fiber + Drei (import dinámico, nunca en el bundle crítico)
- **CMS (fase 6):** Sanity con page builder modular
- **Imágenes (fase 6):** Cloudinary — **Video (fase 6):** Mux
- **Hosting:** Vercel — **Monitoreo:** Vercel Analytics, Web Vitals, Sentry, Search Console
- **Testing:** Vitest, React Testing Library, Playwright, axe, regresión visual
- **CI/CD:** GitHub + GitHub Actions + Vercel Preview Deployments

Regla anti-sobreingeniería: ninguna dependencia entra sin una razón concreta (sección 59 del master prompt). No se agregan Redux, GraphQL ni backend custom. Supabase solo si aparece un requisito real (portal de clientes, careers, contenido privado).

---

## 4. Arquitectura

- **Server Components por defecto.** Client Components solo donde hay interacción, animación imperativa, browser APIs o WebGL. La checklist de la sección 56 del master prompt se aplica componente por componente.
- **Estructura de carpetas** (sección 55 del master prompt, ajustable con justificación):

```text
src/
├── app/            # rutas (App Router), layouts, metadata
├── components/
│   ├── ui/         # botones, tipografía, primitivas
│   ├── navigation/ # menú desktop/mobile, transiciones de menú
│   ├── media/      # imagen/video con la capa abstraída
│   ├── motion/     # reveals, wrappers de GSAP/Framer, transiciones de página
│   ├── 3d/         # escenas R3F (siempre dynamic import)
│   ├── sections/   # secciones de página armadas con lo anterior
│   └── forms/      # formulario progresivo de contacto
├── features/       # lógica por dominio (work/filtros, search futura)
├── lib/            # utilidades puras, capa de contenido, capa de media
├── hooks/
├── providers/      # Lenis, transiciones, consent (fase 7)
├── config/         # site config: navegación, canales de contacto, locale
├── types/
├── styles/         # tokens, globals
└── sanity/         # schemas y cliente (fase 6)
```

- **Capa de contenido (`lib/content`):** funciones tipadas (`getProjects()`, `getPage()`, …). Fase 1-5: leen archivos locales (TS/JSON + media en `/public`). Fase 6: leen Sanity. Las páginas no saben de dónde viene el dato.
- **Capa de media (`components/media`):** `<MediaImage>` y `<MediaVideo>` reciben un descriptor (fuente, variantes desktop/mobile, poster, prioridad de carga: critical/high/lazy/idle). Fase 1-5: sirven archivos locales. Fase 6: resuelven URLs de Cloudinary/Mux. Ninguna página usa `<img>`/`<video>` directo.
- **i18n-ready:** contenido y metadata pasan por la capa de contenido con locale como parámetro (default `es`); sin strings hardcodeados en componentes de sección.
- **Sistema de z-index por tokens:** background → content → navigation → overlays → modals → cursor → loader.

---

## 5. Páginas V1

| Ruta | Contenido |
|---|---|
| `/` | Loader cinematográfico de marca → hero fullscreen con video (variante mobile, poster, fallback) → ubicación + hora local de Buenos Aires en vivo → statement → trabajos seleccionados → capacidades → clientes → CTA |
| `/about` | Quiénes somos, misión, filosofía, cultura — storytelling editorial con scroll + **un** momento WOW mayor (§8) |
| `/work` | Portfolio editorial (NO grilla genérica): layouts variados por proyecto, filtros por categoría que actualizan la URL |
| `/work/[slug]` | Case studies modulares: hero, cliente, servicios, desafío, estrategia, ejecución, galerías, resultados, créditos, proyecto siguiente |
| `/contact` | Statement tipográfico grande → formulario progresivo por pasos (tipo de proyecto → descripción → datos → presupuesto/tiempos) → email, WhatsApp, Instagram, LinkedIn |

Rutas futuras preparadas pero NO construidas en V1: `/services`, `/careers`, `/insights`, `/insights/[slug]`.

---

## 6. Design system (fase 1)

Todo sobre tokens en `styles/` (CSS variables + Tailwind):

- **Color:** primary, secondary, background, surface, text, muted, accent, border, inverse
- **Tipografía:** display, heading, body, caption, label (fuentes placeholder de calidad hasta que llegue la marca; self-hosted via `next/font`)
- **Espaciado:** escala consistente
- **Motion:** duraciones fast / normal / slow / cinematic + curvas de easing con nombre
- **Z-index:** capas nombradas (§4)

Criterio visual (secciones 2 y 58 del master prompt): editorial, cinematográfico, tipografía protagonista, whitespace, composiciones asimétricas. Prohibido: glassmorphism genérico, gradientes decorativos, cards por defecto, estética de template.

---

## 7. Sistema de motion

- **División de responsabilidades** (sección 52): GSAP/ScrollTrigger para scroll-storytelling y timelines; Framer Motion para UI y transiciones de página; Lenis para smooth scroll. Nunca dos motores animando la misma propiedad.
- **Transiciones de página** con continuidad visual (thumbnail de proyecto → hero del case study; case study → proyecto siguiente). Rápidas: nunca sacrifican usabilidad.
- **`prefers-reduced-motion`** respetado globalmente: motion no esencial se reduce o desactiva.
- **Cursor custom** en desktop (estados: default, link, media, drag, view, menu) — se implementa en fase 5 y se evalúa contra usabilidad real; nunca en mobile.

## 8. 3D

- Logo de marca 3D en el loader/hero (fase 5): profundidad, luz, entrada cinematográfica, parallax controlado. Sensación de objeto físico premium, sin movimiento constante innecesario.
- Un (1) momento WOW mayor en About con GSAP + ScrollTrigger + R3F.
- Siempre `dynamic import`; **fallbacks obligatorios**: sin WebGL, gama baja, conexión lenta y reduced-motion reciben una experiencia digna basada en imagen/CSS.
- La web nunca depende de WebGL para funcionar.

## 9. Media

- Registro de assets con metadata: tipo, dimensiones, variante desktop/mobile, poster, prioridad (critical / high / lazy / idle) y estrategia de carga.
- Hero de Home = critical; videos below-the-fold = lazy; 3D = dynamic; lo no visible no se carga.
- Fase 6: Cloudinary (AVIF/WebP, transformaciones responsive, focal points) y Mux (streaming adaptativo, posters, variantes mobile, autoplay muted + playsInline).

## 10. CMS — Sanity (fase 6)

Modelos: Page, Project, CaseStudy, Client, Service, TeamMember, Award, Testimonial, Redirect, SEO metadata, Media. Page builder modular para case studies. Referencias reutilizables (un Client aparece en Home/Work/About sin duplicar datos). Validaciones que impiden publicar contenido con SEO roto (título, meta description, slug, OG image, alt text). Drafts + preview + localización.

## 11. Calidad no negociable (fase 7, medida desde fase 1)

- **Performance:** Core Web Vitals excelentes con usuarios reales (LCP, INP, CLS, TTFB); JS mínimo; hidratación eficiente; presupuesto de bundle vigilado por fase.
- **Accesibilidad:** HTML semántico, navegación por teclado, focus visible, formularios accesibles, contraste, ARIA correcto, axe automatizado.
- **SEO:** metadata dinámica, sitemap, robots, canonical, Open Graph, JSON-LD, OG images dinámicas, breadcrumbs, redirects gestionados (301/302/410).
- **Seguridad:** CSP (Report-Only → enforce), HSTS, security headers, validación de inputs, sanitización, rate limiting en endpoints del formulario.
- **Privacidad:** consent management (necesarias/analytics/marketing) integrado a la identidad visual; nada de tracking no esencial antes del consentimiento.
- **Testing:** Vitest + RTL (unidad/componente), Playwright (E2E: navegación, formulario, filtros, redirects), axe (a11y), regresión visual; matriz desktop/tablet/mobile, reduced motion, fallback WebGL, red lenta.
- **CI/CD:** PR → lint → typecheck → tests → build → E2E → a11y → regresión visual → Vercel Preview. `main` → CI → build → deploy → monitoreo. Nunca se despliega un build roto.

**Test de calidad por página** (sección 57): visual de nivel internacional, UX intuitiva, motion intencional, rápida, accesible, indexable, mantenible, hermosa en todos los dispositivos. Si una categoría falla, la página no está terminada.

---

## 12. Reglas del repositorio

- **Sin atribución de autoría** en código, comentarios, docs, commits ni historial (regla fija del proyecto): commits con mensajes neutrales descriptivos, sin firmas de personas ni de herramientas. Identidad de git local del repo: neutral.
- Commits chicos y frecuentes por fase; push a GitHub al cierre de cada fase como mínimo.

---

## 13. Fases y criterios de salida

| Fase | Construye | Sale cuando |
|---|---|---|
| 1 | Scaffolding Next.js + tokens + design system + layout global + navegación desktop/mobile | Web navegable con identidad base; Lighthouse limpio; sin errores de consola |
| 2 | Home completa: loader (versión 2D), hero video local, secciones, transiciones de página | Home se siente premium en desktop y mobile |
| 3 | Work + case studies con contenido local tipado + filtros con URL | Flujo Home → Work → Case → Next project completo |
| 4 | About + Contact (formulario progresivo validado y protegido) | Web V1 completa navegable |
| 5 | 3D (logo, WOW de About), cursor custom, motion avanzado + todos los fallbacks | WOW sin sacrificar performance ni accesibilidad |
| 6 | Sanity + Cloudinary + Mux + contenido real del cliente **(Lucas crea las cuentas)** | Contenido administrable; media servida por CDN |
| 7 | Performance + SEO + seguridad + a11y + consent + testing completo + CI/CD + Vercel producción **(Lucas crea cuentas Vercel/Sentry)** | Auditoría final de la sección 63 del master prompt aprobada |

Al cierre de cada fase: tests, performance, responsive, accesibilidad, consola y network revisados; Lucas ve el resultado en su navegador y aprueba antes de seguir.

---

## 14. Responsabilidades de Lucas

1. Crear cuentas cuando lleguen las fases 6-7: GitHub (repo), Vercel, Sanity, Cloudinary, Mux, Sentry — con guía paso a paso.
2. Avisar al cliente que Mux y Cloudinary tienen **costo mensual según uso**.
3. Conseguir del diseñador del cliente, para la fase 6 (idealmente antes): logo (SVG), paleta, tipografías (con licencia web), video del hero (desktop y mobile), material de 4-6 proyectos para case studies.
4. Revisar y aprobar cada fase en el navegador.
