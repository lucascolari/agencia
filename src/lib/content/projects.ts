import type { MediaSource, Project, ProjectCategory } from "@/types/content";

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  branding: "Branding",
  digital: "Digital",
  campanas: "Campañas",
  produccion: "Producción",
  social: "Social",
};

/** Orden de aparición de los filtros en /work. */
export const CATEGORY_ORDER: ProjectCategory[] = [
  "branding",
  "digital",
  "campanas",
  "produccion",
  "social",
];

/** Helper para un cover de video de Mux. */
function muxCover(playbackId: string, alt: string): MediaSource {
  return { kind: "mux", playbackId, alt, priority: "high" };
}

/**
 * Portfolio real de gular. Videos alojados en Mux (Playback IDs).
 * Los títulos son los reales; las descripciones detalladas de cada caso se
 * completan más adelante con el material del cliente.
 */
const projects: Project[] = [
  {
    slug: "envision",
    title: "Envision",
    client: "Envision",
    year: 2026,
    categories: ["produccion", "campanas"],
    summary:
      "Producción audiovisual integral: showreel de marca y campaña.",
    cover: muxCover(
      "H8ob3JuHyeu301QekfX014XIWrdmHBQDZKhul6Mi9FfcQ",
      "Showreel de Envision",
    ),
    layout: "full",
    featured: true,
    caseStudy: {
      challenge:
        "Mostrar la ambición de la marca en movimiento, con un lenguaje audiovisual a la altura.",
      strategy:
        "Dirección, edición y postproducción de un showreel y una campaña que hablan el mismo idioma visual.",
      services: ["Dirección", "Producción audiovisual", "Postproducción"],
      blocks: [
        {
          type: "media",
          media: muxCover(
            "1VlwSdLlPCgBkJ3PZgPnTqPAsieJdFWfijy5VWdyN5M",
            "Campaña para Envision",
          ),
          caption: "Campaña.",
        },
      ],
      credits: [{ role: "Producción", name: "gular" }],
    },
  },
  {
    slug: "triumph-rider-academy",
    title: "Triumph Rider Academy",
    client: "Triumph",
    year: 2026,
    categories: ["produccion", "campanas"],
    summary:
      "Dirección, edición y postproducción de la campaña Rider Academy.",
    cover: muxCover(
      "WGUWPcpFD00f8XidLzuoAdR6LZ6eBjJRmPJTPn7XMM9g",
      "Campaña Triumph Rider Academy",
    ),
    layout: "full",
    featured: true,
    caseStudy: {
      challenge:
        "Transmitir la experiencia de la Rider Academy con la energía de la marca.",
      strategy:
        "Realización integral de la campaña: dirección, edición y postproducción.",
      services: ["Dirección", "Edición", "Postproducción"],
      blocks: [],
      credits: [{ role: "Producción", name: "gular" }],
    },
  },
  {
    slug: "agencias-de-turismo",
    title: "Institucional Agencias de Turismo",
    client: "Turismo",
    year: 2026,
    categories: ["produccion"],
    summary: "Video institucional para el sector de agencias de turismo.",
    cover: muxCover(
      "ABlFVC01wyHIYcg65hhSJ4hh01XtRSbQlW01jRVg85kpSI",
      "Video institucional Agencias de Turismo",
    ),
    layout: "full",
    featured: true,
    caseStudy: {
      challenge:
        "Comunicar valor y confianza en una pieza institucional clara y cálida.",
      strategy: "Guion, realización y postproducción del video institucional.",
      services: ["Guion", "Producción audiovisual", "Postproducción"],
      blocks: [],
      credits: [{ role: "Producción", name: "gular" }],
    },
  },
  {
    slug: "sky",
    title: "Sky",
    client: "Sky",
    year: 2026,
    categories: ["produccion"],
    summary: "Pieza audiovisual de marca.",
    cover: muxCover(
      "T3U83BLLLA55g3UdEv5yRHWSrwGJ6x8boWmJpcOJDPY",
      "Pieza audiovisual para Sky",
    ),
    layout: "full",
    featured: true,
    caseStudy: {
      challenge: "Una pieza que respire la identidad de la marca.",
      strategy: "Realización y postproducción de la pieza.",
      services: ["Producción audiovisual", "Postproducción"],
      blocks: [],
      credits: [{ role: "Producción", name: "gular" }],
    },
  },
  {
    slug: "reel",
    title: "Reel de muestra",
    client: "gular",
    year: 2026,
    categories: ["produccion"],
    summary: "Una selección de trabajos audiovisuales en movimiento.",
    cover: muxCover(
      "ZEIHgVg02A9u6GMsZF8uetgclMhg7xBLYw12lAfdmIc8",
      "Reel de muestra de gular",
    ),
    layout: "full",
    featured: false,
    caseStudy: {
      challenge: "Resumir el tono y la calidad del estudio en un solo reel.",
      strategy: "Montaje de piezas seleccionadas con un pulso propio.",
      services: ["Edición", "Postproducción"],
      blocks: [],
      credits: [{ role: "Producción", name: "gular" }],
    },
  },
  {
    slug: "stand",
    title: "Video para stand",
    client: "Activación",
    year: 2026,
    categories: ["produccion"],
    summary: "Contenido audiovisual para stand y activación de marca.",
    cover: muxCover(
      "Z02RUCH8lZJvFJ8pOx16GgjUXBFkJGJ9Re4r9BtZQvvA",
      "Video para stand",
    ),
    layout: "full",
    featured: false,
    caseStudy: {
      challenge: "Captar la atención en un entorno de evento, en loop.",
      strategy: "Pieza pensada para pantalla grande y reproducción continua.",
      services: ["Producción audiovisual", "Postproducción"],
      blocks: [],
      credits: [{ role: "Producción", name: "gular" }],
    },
  },
];

export function getProjects(): Project[] {
  return projects;
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Categorías realmente presentes en el catálogo, en el orden canónico. */
export function getUsedCategories(): ProjectCategory[] {
  const used = new Set(projects.flatMap((p) => p.categories));
  return CATEGORY_ORDER.filter((c) => used.has(c));
}

/** Filtra por categoría; `null`/ausente devuelve todos. */
export function filterProjects(category?: ProjectCategory | null): Project[] {
  if (!category) return projects;
  return projects.filter((p) => p.categories.includes(category));
}

/** Siguiente proyecto en el catálogo (circular), para el bloque "next project". */
export function getNextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
}

export function isProjectCategory(value: string): value is ProjectCategory {
  return (CATEGORY_ORDER as string[]).includes(value);
}
