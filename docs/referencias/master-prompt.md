# MASTER PROMPT — WORLD-CLASS DIGITAL AGENCY WEBSITE

> Documento de referencia del proyecto. Es la vara de calidad de todas las fases.
> Las decisiones de arquitectura y el orden de construcción están en
> `docs/superpowers/specs/2026-08-10-agencia-web-design.md`.

## 0. ROLE

Act as a world-class multidisciplinary digital product team composed of:

- Creative Director
- Digital Art Director
- Senior UX/UI Designer
- Senior Frontend Architect
- Senior Next.js Engineer
- React/TypeScript Engineer
- GSAP Motion Designer
- Three.js / WebGL Engineer
- Performance Engineer
- SEO Engineer
- Accessibility Engineer
- Security Engineer
- DevOps / CI/CD Engineer
- Technical SEO Specialist
- CMS Architect

Your objective is to design and build a world-class, production-ready, multi-page digital agency website capable of competing visually, experientially, technically and strategically with the best agency websites in the world.

The website must feel like a premium digital experience, not a template, not a generic corporate website, and not a collection of disconnected pages.

References for quality, ambition and visual direction:

- https://www.gut.agency/
- https://donzeta.com/

Use these references to understand the level of ambition, visual confidence, storytelling, motion and art direction required.
Do not copy their designs.
Create an original visual identity and experience that can stand on its own and potentially surpass them in execution, performance, interaction quality and technical sophistication.

## 1. PRIMARY OBJECTIVE

Build a website that communicates:

- premium creative quality
- strong brand identity
- technological sophistication
- confidence
- originality
- innovation
- strategic thinking
- cinematic storytelling
- excellent craftsmanship

The website should make a visitor immediately think:
"This agency is operating at an international level."

The experience must balance:
WOW + usability + performance + accessibility + SEO + maintainability.

Never sacrifice usability or performance merely to add visual effects.
Every animation must have a purpose.
Every interaction must feel intentional.
Every visual element must support the brand.

## 2. IMPORTANT CREATIVE PRINCIPLE

Do not create a website that tries to impress through the quantity of effects.
Create a website that feels expensive because of:

- art direction
- typography
- composition
- whitespace
- pacing
- transitions
- sound visual hierarchy
- image/video quality
- interaction design
- motion choreography
- attention to detail

The website should feel:

- cinematic
- editorial
- sophisticated
- experimental
- modern
- confident
- minimal when necessary
- expressive when appropriate

Avoid generic "agency website" patterns.
Avoid excessive gradients.
Avoid generic glassmorphism.
Avoid unnecessary cards.
Avoid excessive rounded containers.
Avoid stock-template aesthetics.
Avoid overusing 3D.
Avoid animations that exist only because they are technically possible.

## 3. CORE TECHNOLOGY STACK

Frontend

- Next.js
- App Router
- React
- TypeScript

Styling

- Tailwind CSS
- CSS variables
- Design Tokens

Animation

- GSAP
- GSAP ScrollTrigger
- Framer Motion
- Lenis

3D

- Three.js
- React Three Fiber
- Drei

CMS

- Sanity
- Modular Page Builder
- Internationalization

Images

- Cloudinary

Video

- Mux

Use Vimeo Enterprise only if a future business requirement specifically justifies it.

Hosting

- Vercel

Optional infrastructure

- Cloudflare only when WAF, DNS, advanced security or edge requirements justify it.

Optional backend

- Supabase only when required for:
  - authentication
  - client portal
  - careers/applications
  - private content
  - other real backend requirements

Monitoring

- Vercel Analytics
- Web Vitals
- Sentry
- Google Search Console

Testing

- Vitest
- React Testing Library
- Playwright
- axe
- Visual regression testing

CI/CD

- GitHub
- GitHub Actions
- Vercel Preview Deployments

## 4. ARCHITECTURE PRINCIPLES

Use a scalable architecture.

Prefer:

- Server Components by default
- Client Components only where interaction is required
- modular components
- reusable systems
- composition over duplication
- dynamic imports
- code splitting
- lazy loading
- progressive enhancement

Do NOT turn the entire application into a Client Component just because the site contains animations.
Keep static content server-rendered whenever possible.

The architecture must support:

- dozens of pages
- hundreds of projects
- large media libraries
- multiple languages
- complex animations
- 3D experiences
- high-resolution video
- future integrations

## 5. DESIGN SYSTEM

Create a complete design system before building individual pages.

Color tokens

- primary
- secondary
- background
- surface
- text
- muted
- accent
- border
- inverse

Typography tokens

- display
- heading
- body
- caption
- label

Spacing

- Create a consistent spacing scale.

Layout

- responsive grid
- max-width containers
- full-bleed layouts
- asymmetric layouts
- editorial compositions

Motion tokens

- fast
- normal
- slow
- cinematic
- easing curves

Z-index system — explicit layers for:

- background
- content
- navigation
- overlays
- modals
- cursor
- loading experience

Use tokens rather than random values.

## 6. DESIGN-TO-CODE PIPELINE

Design and development must remain synchronized.

Figma → Design Tokens → CSS variables / Tailwind → React components → Storybook → Next.js

Do NOT rely on blind Figma-to-code generation.
The goal is to translate design intent into a maintainable component system.

Create reusable components for:

- buttons
- navigation
- typography
- media
- project cards
- section wrappers
- text reveals
- image reveals
- video players
- modals
- forms
- filters
- loaders

## 7. STORYBOOK

Use Storybook as the component development and documentation environment.

Document:

- UI components
- variants
- states
- responsive behavior
- accessibility states
- motion behavior

Storybook should reflect the real production components.

## 8. GLOBAL EXPERIENCE SYSTEM

The entire website must feel like one coherent digital experience.

Navigation System

Desktop:

- minimal navigation
- premium typography
- elegant menu interaction

Mobile:

- fullscreen navigation
- touch-friendly
- smooth transitions

The menu may visually transform between pages.

## 9. PAGE TRANSITIONS

Implement sophisticated page transitions.
Do not simply fade the entire page.

Whenever appropriate, create visual continuity between:

- outgoing page
- incoming page
- project thumbnail
- project hero
- typography
- media

Examples:

- Home → Work: Hero/media transitions into work content.
- Work → Case Study: Project thumbnail expands into the case study hero.
- Case Study → Next Project: Current project transforms into the next project.

Transitions must be fast enough to preserve usability.
Respect `prefers-reduced-motion`.

## 10. GLOBAL CURSOR / POINTER EXPERIENCE

On desktop, consider a custom cursor system.

Possible states:

- default
- link
- image
- video
- drag
- view
- menu

Do not use a custom cursor on mobile.
Do not make the cursor distracting.

## 11. HOME PAGE

Route: `/`

This is the main cinematic entry point.

HERO — must be:

- fullscreen
- immersive
- cinematic
- responsive

Use a high-quality Mux video.

The hero should support:

- desktop video
- mobile-specific video
- poster
- fallback image
- adaptive loading

## 12. CINEMATIC LOADER

Before the hero is ready, show a branded loading experience.
The loader should not feel like a technical loading screen.
It should be part of the agency's identity.

Potential sequence:

1. User enters.
2. Critical resources begin loading.
3. 3D branded element appears.
4. 3D element evolves/transforms.
5. Hero video becomes ready.
6. Loader transitions seamlessly into hero.
7. Hero animation begins.

IMPORTANT:
Do not wait for the entire website to load.
Wait only for critical above-the-fold resources.
Everything else should load progressively in the background.

## 13. 3D BRAND LOGO

Use Three.js + React Three Fiber + Drei.

The logo should have:

- depth
- lighting
- subtle movement
- cinematic entrance
- optional cursor response
- controlled parallax

Avoid unnecessary constant movement.
The logo should feel like a premium physical object.
Optimize geometry, textures and rendering.

## 14. HOME HERO INFORMATION

Display:

- Location: Buenos Aires, Argentina
- Live time: display the current local time dynamically.
- Menu: positioned elegantly within the hero.

These elements must remain readable over the video.
Use appropriate contrast and adaptive overlays.

## 15. HOME AFTER HERO

Do not end the homepage after the hero.

Introduce the agency through:

- strong statement
- selected work
- services or capabilities
- client presence
- CTA

Use editorial storytelling.

Potential sequence:
Hero → Statement → Selected Work → Capabilities → Clients → CTA

Do not overcrowd the page.

## 16. ABOUT PAGE

Route: `/about`

The About page should not feel like a generic corporate presentation.

It should communicate:

- who we are
- what we believe
- mission
- purpose
- philosophy
- culture
- way of working

Use:

- typography
- video
- photography
- 3D
- editorial layouts
- scroll storytelling

## 17. ABOUT WOW MOMENT

Create one major memorable visual experience.

Possible structure:
Scroll → 3D environment appears → camera moves → objects respond to scroll → typography enters → environment transforms

Use GSAP + ScrollTrigger + React Three Fiber.

This must be carefully optimized.

Provide fallback experiences for:

- low-end devices
- unsupported WebGL
- slow connections
- reduced motion

## 18. WORK PAGE

Route: `/work`

This page is the proof of the agency's capabilities.

Do NOT use a generic portfolio grid.
Use a dynamic editorial portfolio.

Projects may use different layouts:

- fullscreen video
- large image
- split layout
- asymmetric composition
- horizontal storytelling
- cinematic project cards

The composition should vary intentionally.

## 19. WORK FILTERING

Support filters such as:

- All
- Branding
- Digital
- Campaigns
- Production
- 3D
- Social
- Other categories defined by CMS

Filters must preserve usability and preferably update URL state when appropriate.

## 20. PROJECTS / CASE STUDIES

Every major project should support a dedicated page.

Route: `/work/[slug]`

A case study may contain:

- hero
- client
- services
- challenge
- strategy
- execution
- video
- image galleries
- 3D experiences
- results
- credits
- next project

The page should feel like a visual editorial story.
Do not force every project into exactly the same layout.
The CMS must support modular project sections.

## 21. ABOUT / WORK RELATIONSHIP

Do not duplicate too much content.
Use reusable Sanity references.

A client can appear in Home, Work, About and Case Study without duplicated data.

## 22. CONTACT PAGE

Route: `/contact`

The Contact page should feel like the final act of the experience.

Opening statement: large typography.
Example direction: "LET'S CREATE SOMETHING TOGETHER."
Do not copy this literally if a better original statement fits the brand.

## 23. CONTACT FORM

Use progressive disclosure.

Step 1: Project type
Step 2: Project description
Step 3: Name / company / email
Step 4: Budget / timeline when appropriate
Step 5: Submit

The form must be:

- accessible
- validated
- protected against spam
- mobile-friendly
- fast

Do not make the form unnecessarily complicated.

## 24. CONTACT CHANNELS

Support:

- email
- WhatsApp
- Instagram
- LinkedIn
- other channels configured through CMS

Display: Buenos Aires, Argentina — and optionally the current local time for continuity with the Home experience.

## 25. CMS ARCHITECTURE

Use Sanity as the content source.
Build a modular page builder.

Content models should include:

- Page
- Project
- Case Study
- Client
- Service
- Team Member
- Award
- Office
- Article
- Testimonial
- Career Position
- Redirect
- SEO metadata
- Media references

Support:

- drafts
- preview
- scheduled publishing
- versioning
- reusable content
- relationships
- localization

## 26. CONTENT GOVERNANCE

CMS validation must help prevent incomplete publishing.

Validate where appropriate:

- SEO title
- meta description
- slug
- OG image
- alt text
- canonical
- required content
- required media
- locale

The system should make it difficult to publish broken SEO/content configurations.

## 27. INTERNATIONALIZATION

Architecture must support multiple languages from the beginning.

Support:

- localized routes
- localized metadata
- localized CMS content
- localized sitemap
- hreflang
- localized structured data

Do not hardcode language assumptions throughout the application.

## 28. MEDIA ARCHITECTURE

Images — use Cloudinary.

Support:

- AVIF
- WebP
- responsive transformations
- dynamic cropping
- focal points
- placeholders
- CDN delivery

Never serve massive original assets when unnecessary.

## 29. VIDEO ARCHITECTURE

Use Mux.

Support:

- adaptive streaming
- posters
- responsive video
- mobile variants
- lazy loading
- preload strategy
- autoplay rules
- muted playback
- playsInline
- fallback images

Never load every video immediately.

## 30. ASSET REGISTRY

Create a conceptual asset management system with metadata such as:

- asset type
- source
- dimensions
- filesize
- mobile variant
- desktop variant
- poster
- preload priority
- loading strategy

Assets should be categorized as:

- critical
- high priority
- lazy
- idle

## 31. ASSET LOADING SYSTEM

Implement intelligent asset loading.

Priority should consider:

- viewport visibility
- network connection
- device capabilities
- asset size
- page importance
- user interaction

Example:

- Hero video → critical
- Below-fold project video → lazy
- 3D experience → dynamic import
- Offscreen gallery → lazy
- Unused assets → do not load

## 32. PROGRESSIVE ENHANCEMENT

The website must adapt its experience to the device.

High-end device — full: WebGL, 3D, advanced animation, high-quality media.
Mid-range device — reduced: fewer effects, optimized 3D, reduced particles.
Low-end device — lightweight: images/video, CSS animation, simplified effects.
Slow network — lower-resolution media, posters, delayed loading.
Reduced motion — reduce or disable non-essential motion.

## 33. MOBILE EXPERIENCE

Do NOT simply make desktop responsive.
Design mobile intentionally.

Mobile may have:

- different video
- different animation
- different layout
- different 3D behavior
- different navigation
- different asset strategy

The mobile experience must still feel premium.

## 34. SITE SEARCH

Implement site-wide search.

Search across: projects, case studies, services, articles, clients, team, pages.

Initial implementation can use the CMS/search layer.
When content scale requires it, support Algolia or Typesense.

Search should support:

- keyboard navigation
- suggestions
- grouped results
- empty state
- fast interaction

Optional Command Palette: `⌘ K`

## 35. REDIRECT MANAGEMENT

Create CMS-managed redirects.

Support 301, 302, and 410 where appropriate.

Use redirects to protect SEO when URLs change.
Validate redirect destinations.
Avoid redirect chains.

## 36. SEO

Implement comprehensive technical SEO:

- dynamic metadata
- sitemap
- robots
- canonical URLs
- Open Graph
- social metadata
- JSON-LD
- structured data
- breadcrumbs
- dynamic OG images
- localized SEO
- internal linking
- clean URLs

Case studies must be indexable when appropriate.

## 37. SECURITY

Implement:

- CSP
- security headers
- HSTS
- Referrer-Policy
- Permissions-Policy
- X-Content-Type-Options
- secure cookies
- SameSite
- input validation
- output sanitization
- endpoint protection
- rate limiting where necessary

Start CSP using Report-Only mode. Audit required resources. Then enforce the policy.
Do not use unsafe policies simply to make development easier.

## 38. PRIVACY / COMPLIANCE

Implement cookie/consent management.

Separate: necessary, analytics, marketing, preferences.

Do not initialize non-essential tracking before the appropriate consent.

Include Privacy Policy, Cookie Policy and Terms where required.
The consent experience must match the visual identity of the site.

## 39. PERFORMANCE TARGETS

Treat performance as a first-class feature.

Target:

- excellent Core Web Vitals
- minimal JavaScript
- fast initial render
- optimized media
- minimal blocking resources
- efficient hydration
- efficient animation
- no unnecessary client components

Monitor: LCP, INP, CLS, TTFB, bundle size, asset sizes, runtime errors.

Do not optimize only for Lighthouse. Optimize for real users.

## 40. ACCESSIBILITY

Implement strong accessibility:

- semantic HTML
- keyboard navigation
- focus management
- accessible forms
- screen readers
- contrast
- reduced motion
- appropriate ARIA
- visible focus states

Use automated axe testing.

## 41. ANALYTICS

Use: Vercel Analytics, Web Vitals, Sentry, Google Search Console.
Optionally prepare PostHog.

Track meaningful interactions:

- project views
- case study views
- CTA clicks
- contact submissions
- outbound links
- navigation interactions

Respect consent requirements.

## 42. OBSERVABILITY

Monitor:

- JavaScript errors
- failed requests
- slow pages
- Web Vitals
- media failures
- hydration errors
- route errors
- performance regressions

Use Sentry for runtime errors.

## 43. TESTING

- Unit: Vitest
- Component: React Testing Library
- E2E: Playwright
- Accessibility: axe
- Visual regression: screenshot-based testing

Test:

- desktop, tablet, mobile
- major browsers
- reduced motion
- WebGL fallback
- slow network
- navigation, forms, search, redirects

## 44. CI/CD

Pull Request:

```text
Lint → Typecheck → Unit Tests → Build → E2E → Accessibility → Visual Regression → Vercel Preview
```

Production:

```text
main → CI → Build → Deploy → Monitoring
```

Never deploy broken builds.

## 45. OPTIONAL BACKEND

Do not add a backend unless required.

Use Supabase only for: authentication, client portal, careers/applications, private content, other genuine backend requirements.

Do not add Redux, GraphQL, custom Node backend or unnecessary databases without a real architectural reason.

## 46. OPTIONAL FUTURE FEATURES

Prepare the architecture so it can later support:

- CRM integration
- client portal
- advanced search
- A/B testing
- feature flags
- personalization
- careers
- insights/blog
- additional services
- additional locales

Do not implement these prematurely.

## 47. PAGE ARCHITECTURE

Initial information architecture:

```text
/
├── Home
├── About
├── Work
│   └── [project]
└── Contact
```

Future-ready:

```text
/services
/careers
/insights
/insights/[slug]
/work/[slug]
```

Do not force future pages into V1 if they are not required.

## 48. HOME EXPERIENCE

Required experience:

1. Cinematic loading experience.
2. 3D branded logo.
3. Fullscreen hero video.
4. Location.
5. Live Buenos Aires time.
6. Menu.
7. Strong transition into content.
8. Selected work.
9. Agency statement.
10. CTA.

The Hero should feel like an immediate statement of quality.

## 49. ABOUT EXPERIENCE

Required:

- Who we are
- Mission
- Purpose
- Philosophy
- Visual storytelling
- Video/image/3D WOW moment
- Culture/team where appropriate
- CTA

Use one major memorable interactive experience rather than many small effects.

## 50. WORK EXPERIENCE

Required:

- large visual project presentation
- video
- image
- clients
- filters
- services/capabilities
- methodology
- individual case studies

Projects should be visually varied.

## 51. CONTACT EXPERIENCE

Required:

- strong opening statement
- progressive contact form
- email, WhatsApp, Instagram, LinkedIn
- Buenos Aires
- optional live time
- strong closing CTA

Conversion should be prioritized over unnecessary visual complexity.

## 52. MOTION RULES

Use GSAP for:

- scroll-driven storytelling
- complex timelines
- pinned scenes
- cinematic sequences
- WebGL synchronization

Use Framer Motion for:

- UI transitions
- menus
- modals
- page transitions
- component state
- layout animation

Use Lenis for smooth scrolling.

Do not have multiple animation engines fighting over the same property.

## 53. 3D RULES

Use 3D only when it improves:

- storytelling
- identity
- interaction
- emotional impact

Optimize: polygon count, textures, draw calls, lighting, shaders, frame rate.

Provide fallbacks.
Never make the entire website dependent on WebGL.

## 54. CODE QUALITY

Code must be:

- readable
- modular
- strongly typed
- maintainable
- documented where necessary
- reusable
- production-ready

Avoid:

- giant components
- duplicated logic
- random magic numbers
- excessive global state
- unnecessary dependencies
- unnecessary client rendering
- hacks that solve one viewport only

## 55. COMPONENT ARCHITECTURE

Use a structure similar to:

```text
src/
├── app/
├── components/
│   ├── ui/
│   ├── navigation/
│   ├── media/
│   ├── motion/
│   ├── 3d/
│   ├── sections/
│   └── forms/
├── features/
├── lib/
├── hooks/
├── providers/
├── config/
├── types/
├── styles/
└── sanity/
```

Adjust the structure if a better architecture is justified.
Do not blindly follow this structure if it creates unnecessary abstraction.

## 56. RESPONSIBILITY RULES

Before implementing a component, determine:

1. Is it static?
2. Does it require browser APIs?
3. Does it require animation?
4. Does it require WebGL?
5. Does it require CMS data?
6. Does it need to be interactive?
7. Can it remain a Server Component?

Only use client-side rendering when necessary.

## 57. DESIGN QUALITY BAR

Every page must pass this test:

- Visual: Does it look like a world-class agency?
- UX: Is it intuitive?
- Motion: Does movement feel intentional?
- Performance: Does it remain fast?
- Accessibility: Can different users navigate it?
- SEO: Can search engines understand it?
- Maintainability: Can another developer extend it?
- Responsiveness: Does it work beautifully across devices?

If one category fails, the implementation is not finished.

## 58. ANTI-GENERIC RULE

Do not use generic:

- hero templates
- card grids
- gradients
- dashboard layouts
- stock illustrations
- generic buttons
- generic navigation
- generic SaaS patterns

The design must have an identifiable creative direction.

## 59. ANTI-OVERENGINEERING RULE

Do not add technologies simply because they are impressive.
Every dependency must have a reason.
If a feature can be implemented cleanly with existing tools, do not introduce another library.

## 60. DEVELOPMENT PROCESS

Before writing significant code:

1. Analyze the requirements.
2. Define information architecture.
3. Define design system.
4. Define motion system.
5. Define media strategy.
6. Define CMS schema.
7. Define component architecture.
8. Define performance strategy.
9. Define accessibility/security strategy.
10. Create implementation plan.

Only then begin implementation.

## 61. ITERATIVE DEVELOPMENT

Do not attempt to build the entire website blindly in one pass.

Build in stages:

- Phase 1: Foundation.
- Phase 2: Design system.
- Phase 3: Navigation.
- Phase 4: Home.
- Phase 5: About.
- Phase 6: Work.
- Phase 7: Case studies.
- Phase 8: Contact.
- Phase 9: CMS.
- Phase 10: Advanced animation/3D.
- Phase 11: Performance.
- Phase 12: SEO/security/accessibility.
- Phase 13: Testing.
- Phase 14: Production hardening.

After every major phase:

- run tests
- inspect performance
- inspect responsive behavior
- inspect accessibility
- inspect console
- inspect network requests
- fix regressions

## 62. FINAL CREATIVE STANDARD

The final result must NOT feel like "an AI-generated agency website."
It must feel like "a digital experience created by an elite creative technology studio."

The visitor should remember:

- the first impression
- the motion
- the typography
- the visual storytelling
- the work
- the brand

The technology should be invisible.
The experience should be memorable.

## 63. FINAL NON-NEGOTIABLE REQUIREMENTS

The final website must be:

- multi-page
- production-ready
- responsive
- accessible
- SEO-ready
- CMS-driven
- internationalization-ready
- secure
- performant
- scalable
- media-heavy capable
- animation-heavy capable
- WebGL-capable
- maintainable
- testable
- observable
- deployable through CI/CD

Most importantly:
Do not optimize for "having the most technology."
Optimize for creating the best possible digital agency experience.

The website must aim to compete with and exceed the quality bar established by the world's leading creative agencies.

Before considering the project finished, perform a final audit across:

- visual quality
- UX
- animation
- 3D
- performance
- accessibility
- SEO
- security
- responsive behavior
- code quality
- CMS
- testing
- analytics
- error handling
- asset loading

If something can be significantly improved without introducing unnecessary complexity, improve it.
