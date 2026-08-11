# Guía de conexión de servicios (Fases 6 y 7)

> Todo lo que sigue necesita que **vos** (Lucas) crees las cuentas y pases las
> credenciales, porque son cuentas del proyecto/cliente. Con eso hecho, conectar
> cada servicio es un trabajo corto porque la arquitectura ya está preparada.
> Las claves van en `.env.local` (ver [`.env.example`](../../.env.example)).
> **Ojo con los costos:** Mux y Cloudinary cobran por uso; avisale al cliente.

---

## 1. Vercel (deploy) — el primero, no tiene costo para empezar

1. Crear cuenta en https://vercel.com (con el GitHub del proyecto).
2. Crear el repo en GitHub y subir el código (ver "Deploy" abajo).
3. En Vercel: **Add New → Project →** importar el repo. Detecta Next.js solo.
4. En **Settings → Environment Variables** cargar `NEXT_PUBLIC_SITE_URL` con el
   dominio final.
5. Deploy. Cada push a `main` publica; cada PR genera un preview.

## 2. Sanity (CMS) — Fase 6

1. Crear proyecto en https://www.sanity.io → anotar **Project ID** y dataset
   (`production`).
2. Cargar en `.env.local`: `NEXT_PUBLIC_SANITY_PROJECT_ID`,
   `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` (token de solo lectura).
3. Punto de conexión en el código: la **capa de contenido** en
   [`src/lib/content/`](../../src/lib/content). Hoy `projects.ts` y `ui.ts`
   devuelven datos locales tipados. En fase 6 se reemplaza el cuerpo de esas
   funciones (`getProjects`, `getProjectBySlug`, …) por consultas GROQ a Sanity.
   **Los componentes y páginas no cambian** porque consumen esas funciones, no
   los datos crudos. Los tipos de [`src/types/content.ts`](../../src/types/content.ts)
   son el contrato del schema de Sanity.

## 3. Cloudinary (imágenes) — Fase 6

1. Crear cuenta en https://cloudinary.com → anotar **Cloud name**.
2. Cargar `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` en `.env.local`.
3. Punto de conexión: [`src/components/media/MediaFrame.tsx`](../../src/components/media/MediaFrame.tsx).
   Hoy sirve archivos locales/placeholder. Se agrega la resolución de URLs de
   Cloudinary (AVIF/WebP, transformaciones responsive) para `kind: "image"`.
   El `MediaSource.src` pasa a ser el public ID de Cloudinary. Ninguna sección
   se toca: todas pasan por `<MediaFrame>`.
4. Agregar el dominio `res.cloudinary.com` a `img-src` en la CSP de
   [`next.config.ts`](../../next.config.ts) y a `images.remotePatterns`.

## 4. Mux (video) — Fase 6

1. Crear cuenta en https://dashboard.mux.com → **Settings → API Access Tokens**
   → anotar `MUX_TOKEN_ID` y `MUX_TOKEN_SECRET`.
2. Cargarlas en `.env.local`.
3. Subir el video del hero (desktop y mobile) a Mux → anotar los **Playback ID**.
4. Punto de conexión: `MediaFrame` para `kind: "video"` + el hero
   ([`src/components/sections/HomeHero.tsx`](../../src/components/sections/HomeHero.tsx)),
   que hoy muestra un gradiente placeholder detrás del objeto 3D. Se agrega
   `<mux-player>` / streaming HLS con poster y variante mobile.
5. Agregar `stream.mux.com` y `*.litix.io` a `media-src`/`connect-src` en la CSP.

## 5. Sentry (errores, opcional) — Fase 7

1. Crear proyecto en https://sentry.io → anotar el **DSN**.
2. Cargar `NEXT_PUBLIC_SENTRY_DSN`. Instalar `@sentry/nextjs` y correr su wizard.

---

## Deploy inicial a GitHub

Cuando tengas el repo creado en tu GitHub (privado, nombre `agencia`):

```bash
cd /c/dev/agencia
git remote add origin <URL-del-repo>
git push -u origin main
```

A partir de ahí, el ciclo es el de siempre: editar → `git add .` →
`git commit -m "..."` → `git push`.

---

## Estado actual (2026-08-10)

- ✅ Fases 1–5 completas (fundación, home, work+case studies, about+contact, 3D).
- ✅ Fase 7 (autónoma) hecha: SEO técnico, headers de seguridad + CSP report-only,
  accesibilidad (skip link, landmarks, focus), sitemap, robots, JSON-LD.
- ⏳ Fase 6 (Sanity/Cloudinary/Mux) y deploy: **esperan que crees las cuentas**.
- Todo corre con contenido y media placeholder sobre design tokens; la marca
  real y el material del cliente entran por los puntos de conexión de arriba.
