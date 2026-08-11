import type { Project, ProjectCategory } from "@/types/content";

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  branding: "Branding",
  digital: "Digital",
  campanas: "Campañas",
  produccion: "Producción",
  social: "Social",
};

/**
 * Proyectos placeholder (clientes ficticios) hasta que llegue el material real.
 * En fase 6 esta capa pasa a leer de Sanity sin cambiar su interfaz.
 */
const projects: Project[] = [
  {
    slug: "nucleo-rebrand",
    title: "Una marca que vuelve a hervir",
    client: "Núcleo",
    year: 2026,
    categories: ["branding", "campanas"],
    summary:
      "Rebranding integral y campaña de relanzamiento para una marca de bebidas con 40 años de historia.",
    cover: {
      kind: "placeholder",
      alt: "Identidad visual de Núcleo",
      tone: "#23303a",
      priority: "high",
    },
    layout: "full",
    featured: true,
  },
  {
    slug: "faro-campana",
    title: "Asegurar también es emocionar",
    client: "Faro Seguros",
    year: 2026,
    categories: ["campanas", "produccion"],
    summary:
      "Campaña audiovisual multiplataforma que corrió el eje de la categoría: del miedo a la confianza.",
    cover: {
      kind: "placeholder",
      alt: "Campaña de Faro Seguros",
      tone: "#3a2f28",
      priority: "lazy",
    },
    layout: "split",
    featured: true,
  },
  {
    slug: "andino-ecommerce",
    title: "El mercado que baja de la montaña",
    client: "Mercado Andino",
    year: 2025,
    categories: ["digital", "branding"],
    summary:
      "Plataforma de e-commerce y sistema de diseño para el marketplace regional de productos de origen.",
    cover: {
      kind: "placeholder",
      alt: "Plataforma digital de Mercado Andino",
      tone: "#2e3a2f",
      priority: "lazy",
    },
    layout: "tall",
    featured: true,
  },
  {
    slug: "volta-lanzamiento",
    title: "Electricidad en estado puro",
    client: "Volta Motos",
    year: 2025,
    categories: ["produccion", "digital"],
    summary:
      "Film de lanzamiento y experiencia web inmersiva para la primera moto eléctrica de fabricación nacional.",
    cover: {
      kind: "placeholder",
      alt: "Lanzamiento de Volta Motos",
      tone: "#3a2836",
      priority: "lazy",
    },
    layout: "split",
    featured: true,
  },
  {
    slug: "rioja-social",
    title: "Historias que fermentan",
    client: "Rioja Films",
    year: 2025,
    categories: ["social", "produccion"],
    summary:
      "Dirección creativa y contenido social para una productora que necesitaba hablar con su propia voz.",
    cover: {
      kind: "placeholder",
      alt: "Contenido social de Rioja Films",
      tone: "#32323c",
      priority: "lazy",
    },
    layout: "full",
    featured: false,
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
