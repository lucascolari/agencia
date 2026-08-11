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
