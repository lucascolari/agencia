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
      hero: {
        eyebrow: "Soluciones digitales — Buenos Aires",
        title: "Ideas que se sienten.",
        lead: "Marcas, campañas y experiencias digitales para empresas que quieren jugar en primera.",
        scrollHint: "Deslizá",
        timeLabel: "BUE",
      },
      statement: {
        eyebrow: "Manifiesto",
        lines: [
          "Somos un estudio de soluciones digitales.",
          "Diseñamos marcas, campañas y experiencias",
          "que la gente recuerda.",
        ],
      },
      selectedWork: {
        eyebrow: "Trabajos seleccionados",
        title: "Lo que hicimos habla por nosotros.",
        viewAll: "Ver todos los trabajos",
      },
      capabilities: {
        eyebrow: "Capacidades",
        title: "Todo lo que una marca necesita para moverse.",
        items: [
          {
            title: "Branding",
            description:
              "Identidades que se reconocen a un metro y a un segundo: estrategia, naming, sistemas visuales.",
          },
          {
            title: "Diseño digital",
            description:
              "Webs, e-commerce y productos digitales diseñados para convertir sin dejar de emocionar.",
          },
          {
            title: "Campañas",
            description:
              "Ideas que cruzan medios: de la vía pública al feed, con un mismo pulso creativo.",
          },
          {
            title: "Producción audiovisual",
            description:
              "Films, contenido y dirección de arte con calidad de cine y velocidad de internet.",
          },
        ],
      },
      clients: {
        eyebrow: "Confiaron en nosotros",
        names: [
          "Núcleo",
          "Faro Seguros",
          "Mercado Andino",
          "Volta Motos",
          "Rioja Films",
          "Delta Bank",
          "Astra Foods",
          "Pampa Energía Verde",
        ],
      },
      closing: {
        title: "Tu marca puede ser la próxima.",
        action: "Hablemos",
      },
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
