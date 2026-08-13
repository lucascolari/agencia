import type { Project, ProjectCategory } from "@/types/content";

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
    caseStudy: {
      challenge:
        "Núcleo era una marca querida pero envejecida. Cuarenta años de historia pesaban como ancla, no como bandera. Había que rejuvenecer sin traicionar.",
      strategy:
        "Recuperamos el gesto fundacional de la marca —el burbujeo— y lo convertimos en sistema: un lenguaje visual vivo, que se mueve y reacciona, tan cómodo en una lata como en una pantalla.",
      services: ["Estrategia de marca", "Identidad visual", "Campaña", "Motion"],
      blocks: [
        {
          type: "media",
          media: {
            kind: "placeholder",
            alt: "Sistema de identidad Núcleo",
            tone: "#23303a",
            priority: "high",
          },
          caption: "Nuevo sistema de identidad y packaging.",
        },
        {
          type: "text",
          heading: "Del logo al sistema",
          body: "No rediseñamos un logo: construimos un sistema capaz de vivir en cientos de piezas sin perder el pulso. Tipografía propia, paleta que respira y un principio de movimiento que atraviesa todo.",
        },
        {
          type: "metrics",
          items: [
            { value: "+38%", label: "Reconocimiento de marca" },
            { value: "3", label: "Mercados nuevos" },
            { value: "40°", label: "Aniversario relanzado" },
          ],
        },
        {
          type: "quote",
          quote:
            "Volvimos a ser la marca que éramos, pero por primera vez parecemos del futuro.",
          author: "Dirección de Marketing, Núcleo",
        },
      ],
      credits: [
        { role: "Dirección creativa", name: "Estudio" },
        { role: "Diseño", name: "Equipo de marca" },
        { role: "Motion", name: "Equipo audiovisual" },
      ],
    },
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
      kind: "mux",
      playbackId: "ABlFVC01wyHIYcg65hhSJ4hh01XtRSbQlW01jRVg85kpSI",
      alt: "Video institucional Agencias de Turismo",
      priority: "high",
    },
    layout: "full",
    featured: true,
    caseStudy: {
      challenge:
        "Toda la categoría de seguros vende miedo. Faro quería vender lo contrario: la tranquilidad de estar cubierto, contada sin letra chica.",
      strategy:
        "Una campaña construida sobre historias reales, filmadas con lenguaje de cine. Menos siniestro, más vida. El seguro como quien enciende una luz, no como quien anticipa la tormenta.",
      services: ["Idea", "Producción audiovisual", "Dirección de arte", "Medios"],
      blocks: [
        {
          type: "media",
          media: {
            kind: "placeholder",
            alt: "Film principal de Faro",
            tone: "#3a2f28",
            priority: "high",
          },
          caption: "Film principal — 60 segundos.",
        },
        {
          type: "text",
          heading: "Una luz en la costa",
          body: "El faro dejó de ser un logo para volverse metáfora: la marca que ilumina cuando todo se pone oscuro. Cada pieza de la campaña es una variación de esa misma luz.",
        },
        {
          type: "gallery",
          items: [
            {
              kind: "placeholder",
              alt: "Frame 01",
              tone: "#3a2f28",
              priority: "lazy",
            },
            {
              kind: "placeholder",
              alt: "Frame 02",
              tone: "#463a30",
              priority: "lazy",
            },
            {
              kind: "placeholder",
              alt: "Frame 03",
              tone: "#2f2822",
              priority: "lazy",
            },
          ],
        },
        {
          type: "metrics",
          items: [
            { value: "12M", label: "Views orgánicas" },
            { value: "+21%", label: "Cotizaciones online" },
            { value: "#1", label: "Recuerdo de campaña" },
          ],
        },
      ],
      credits: [
        { role: "Dirección creativa", name: "Estudio" },
        { role: "Producción", name: "Casa productora" },
        { role: "Dirección", name: "Realización" },
      ],
    },
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
    caseStudy: {
      challenge:
        "Cientos de productores de altura, cero infraestructura digital. Había que conectar el origen con la ciudad sin que se perdiera la historia en el camino.",
      strategy:
        "Diseñamos una plataforma y un sistema de diseño escalable que le da a cada productor una vidriera con identidad propia, sin romper la coherencia del conjunto.",
      services: ["Producto digital", "Design system", "E-commerce", "Branding"],
      blocks: [
        {
          type: "media",
          media: {
            kind: "placeholder",
            alt: "Interfaz de Mercado Andino",
            tone: "#2e3a2f",
            priority: "high",
          },
          caption: "Home y ficha de producto.",
        },
        {
          type: "text",
          heading: "Origen, a un clic",
          body: "Cada producto cuenta de dónde viene, quién lo hizo y a qué altura creció. La tecnología desaparece para que la historia sea protagonista.",
        },
        {
          type: "metrics",
          items: [
            { value: "240+", label: "Productores online" },
            { value: "x3", label: "Ventas primer trimestre" },
            { value: "1.2s", label: "LCP promedio" },
          ],
        },
      ],
      credits: [
        { role: "Dirección de producto", name: "Estudio" },
        { role: "Ingeniería", name: "Equipo de desarrollo" },
        { role: "Diseño", name: "Equipo de producto" },
      ],
    },
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
      kind: "mux",
      playbackId: "WGUWPcpFD00f8XidLzuoAdR6LZ6eBjJRmPJTPn7XMM9g",
      alt: "Campaña Triumph Rider Academy",
      priority: "high",
    },
    layout: "full",
    featured: true,
    caseStudy: {
      challenge:
        "Lanzar la primera moto eléctrica nacional contra gigantes globales. Sin presupuesto de gigante, pero con una historia que ellos no tienen: es de acá.",
      strategy:
        "Un film de lanzamiento con tensión de tráiler y una experiencia web que deja tocar la moto antes de tenerla enfrente. Orgullo local, ejecución global.",
      services: ["Film", "Experiencia web", "3D", "Lanzamiento"],
      blocks: [
        {
          type: "media",
          media: {
            kind: "placeholder",
            alt: "Film de lanzamiento Volta",
            tone: "#3a2836",
            priority: "high",
          },
          caption: "Film de lanzamiento.",
        },
        {
          type: "quote",
          quote:
            "Agotamos la preventa en 72 horas. La web hizo la mitad del trabajo.",
          author: "Fundador, Volta Motos",
        },
        {
          type: "metrics",
          items: [
            { value: "72h", label: "Preventa agotada" },
            { value: "+90", label: "Score de performance" },
            { value: "8", label: "Medios de prensa" },
          ],
        },
      ],
      credits: [
        { role: "Dirección creativa", name: "Estudio" },
        { role: "3D & Web", name: "Equipo interactivo" },
        { role: "Film", name: "Casa productora" },
      ],
    },
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
    caseStudy: {
      challenge:
        "Una productora que filma para todos pero no tenía tiempo de filmarse a sí misma. El zapatero descalzo del audiovisual.",
      strategy:
        "Un sistema de contenido social liviano de producir pero imposible de confundir: formato propio, tono propio, ritmo propio. Consistencia antes que volumen.",
      services: ["Dirección creativa", "Contenido social", "Producción"],
      blocks: [
        {
          type: "media",
          media: {
            kind: "placeholder",
            alt: "Grilla de contenido Rioja",
            tone: "#32323c",
            priority: "high",
          },
          caption: "Sistema de contenido para redes.",
        },
        {
          type: "text",
          heading: "La voz propia",
          body: "Definimos un formato reconocible a primera vista y un calendario sostenible. La marca dejó de improvisar y empezó a construir.",
        },
        {
          type: "metrics",
          items: [
            { value: "+64%", label: "Engagement" },
            { value: "x2.5", label: "Seguidores en 6 meses" },
          ],
        },
      ],
      credits: [
        { role: "Dirección creativa", name: "Estudio" },
        { role: "Contenido", name: "Equipo social" },
      ],
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
