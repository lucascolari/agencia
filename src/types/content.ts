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

export type MediaPriority = "critical" | "high" | "lazy" | "idle";

export interface MediaSource {
  kind: "video" | "image" | "placeholder";
  /** Ruta local hoy; URL de Mux/Cloudinary en fase 6 sin tocar componentes. */
  src?: string;
  mobileSrc?: string;
  poster?: string;
  alt: string;
  /** Color de superficie para placeholders editoriales. */
  tone?: string;
  priority: MediaPriority;
}

export type ProjectCategory =
  | "branding"
  | "digital"
  | "campanas"
  | "produccion"
  | "social";

export interface Project {
  slug: string;
  title: string;
  client: string;
  year: number;
  categories: ProjectCategory[];
  summary: string;
  cover: MediaSource;
  /** Variación editorial del layout en /work. */
  layout: "full" | "split" | "tall";
  featured: boolean;
}

export interface CapabilityItem {
  title: string;
  description: string;
}

export interface HomeContent {
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    scrollHint: string;
    timeLabel: string;
  };
  statement: { eyebrow: string; lines: string[] };
  selectedWork: { eyebrow: string; title: string; viewAll: string };
  capabilities: { eyebrow: string; title: string; items: CapabilityItem[] };
  clients: { eyebrow: string; names: string[] };
  closing: { title: string; action: string };
}

export interface UiStrings {
  nav: NavItem[];
  menu: { open: string; close: string };
  footer: { rights: string };
  pages: {
    home: HomeContent;
    about: PageContent;
    work: PageContent;
    contact: PageContent;
  };
}
