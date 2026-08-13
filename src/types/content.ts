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
  kind: "mux" | "video" | "image" | "placeholder";
  /** Ruta local (archivo en /public) para imagen o video. */
  src?: string;
  mobileSrc?: string;
  poster?: string;
  /** Public ID de Cloudinary (ej: "proyectos/nucleo/hero"). Tiene prioridad
   *  sobre `src` cuando hay Cloud name configurado. */
  cloudinaryId?: string;
  /** Playback ID de Mux para `kind: "mux"` (streaming adaptativo). */
  playbackId?: string;
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

/** Bloques modulares de un case study (spec §20). Cada proyecto compone los suyos. */
export type CaseStudyBlock =
  | { type: "text"; heading: string; body: string }
  | { type: "media"; media: MediaSource; caption?: string }
  | { type: "gallery"; items: MediaSource[] }
  | { type: "quote"; quote: string; author: string }
  | { type: "metrics"; items: { value: string; label: string }[] };

export interface CaseStudy {
  challenge: string;
  strategy: string;
  services: string[];
  blocks: CaseStudyBlock[];
  credits: { role: string; name: string }[];
}

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
  caseStudy: CaseStudy;
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
    /** Video de fondo del hero (Mux). Si está, reemplaza el fondo 3D/gradiente. */
    video?: MediaSource;
  };
  statement: { eyebrow: string; lines: string[] };
  selectedWork: { eyebrow: string; title: string; viewAll: string };
  capabilities: { eyebrow: string; title: string; items: CapabilityItem[] };
  clients: { eyebrow: string; names: string[] };
  closing: { title: string; action: string };
}

export interface AboutContent {
  meta: { title: string; description: string };
  intro: PageIntroContent;
  wow: { eyebrow: string; headline: string };
  mission: { eyebrow: string; lines: string[] };
  beliefs: { eyebrow: string; title: string; items: CapabilityItem[] };
  culture: { eyebrow: string; title: string; body: string; stats: { value: string; label: string }[] };
  closing: { title: string; action: string };
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
}

export interface ContactContent {
  meta: { title: string; description: string };
  intro: { eyebrow: string; title: string; lead: string };
  form: {
    steps: {
      projectType: { legend: string; options: string[] };
      description: { legend: string; placeholder: string };
      details: {
        legend: string;
        name: string;
        company: string;
        email: string;
      };
      budget: { legend: string; options: string[] };
    };
    back: string;
    next: string;
    submit: string;
    success: { title: string; body: string };
    errors: { required: string; email: string };
    progress: string;
  };
  channelsEyebrow: string;
  channels: ContactChannel[];
  timeLabel: string;
}

export interface UiStrings {
  nav: NavItem[];
  menu: { open: string; close: string };
  footer: { rights: string };
  pages: {
    home: HomeContent;
    about: AboutContent;
    work: PageContent;
    contact: ContactContent;
  };
}
