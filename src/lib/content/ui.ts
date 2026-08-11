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
      wow: {
        eyebrow: "Nuestra forma de ver",
        headline: "Atravesamos el ruido.",
      },
      mission: {
        eyebrow: "Por qué existimos",
        lines: [
          "Creemos que una marca no se mira: se siente.",
          "Existimos para construir esas marcas —las que",
          "erizan la piel— con la misma rigurosidad con la",
          "que un ingeniero construye un puente.",
        ],
      },
      beliefs: {
        eyebrow: "Lo que creemos",
        title: "Cuatro convicciones que no negociamos.",
        items: [
          {
            title: "La forma es fondo",
            description:
              "Un detalle mal resuelto contamina toda la obra. Cuidamos el kerning como quien cuida una relación.",
          },
          {
            title: "La estrategia primero",
            description:
              "Nada de lo que hacemos es decorativo. Cada decisión de diseño responde a un objetivo de negocio.",
          },
          {
            title: "La tecnología, invisible",
            description:
              "El mejor código es el que no se nota. Performance y accesibilidad no son extras: son la base.",
          },
          {
            title: "El trabajo habla",
            description:
              "No creemos en las promesas largas. Creemos en mostrar, medir y volver a intentar hasta que salga bien.",
          },
        ],
      },
      culture: {
        eyebrow: "Cómo trabajamos",
        title: "Equipo chico, ambición grande.",
        body: "Somos un grupo reducido de gente obsesiva: estrategas, diseñadores, desarrolladores y realizadores que prefieren hacer pocas cosas y hacerlas impecables. Trabajamos codo a codo con cada cliente, sin capas intermedias ni cuentas que diluyan la idea.",
        stats: [
          { value: "12", label: "Personas en el equipo" },
          { value: "40+", label: "Proyectos entregados" },
          { value: "9", label: "Países alcanzados" },
        ],
      },
      closing: {
        title: "¿Trabajamos juntos?",
        action: "Hablemos",
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
      form: {
        steps: {
          projectType: {
            legend: "¿Qué necesitás?",
            options: [
              "Branding",
              "Sitio o producto digital",
              "Campaña",
              "Producción audiovisual",
              "Otra cosa",
            ],
          },
          description: {
            legend: "Contanos un poco más",
            placeholder:
              "¿Qué tenés en mente? Cuanto más nos cuentes, mejor.",
          },
          details: {
            legend: "¿Cómo te contactamos?",
            name: "Nombre",
            company: "Empresa",
            email: "Email",
          },
          budget: {
            legend: "Presupuesto estimado",
            options: [
              "Menos de US$ 5.000",
              "US$ 5.000 – 15.000",
              "US$ 15.000 – 40.000",
              "Más de US$ 40.000",
              "Todavía no lo sé",
            ],
          },
        },
        back: "Atrás",
        next: "Siguiente",
        submit: "Enviar",
        success: {
          title: "¡Gracias! Recibimos tu mensaje.",
          body: "Te vamos a responder dentro de las próximas 24 horas hábiles.",
        },
        errors: {
          required: "Este campo es obligatorio.",
          email: "Ingresá un email válido.",
        },
        progress: "Paso",
      },
      channelsEyebrow: "O escribinos directo",
      channels: [
        {
          label: "Email",
          value: "hola@agencia.com",
          href: "mailto:hola@agencia.com",
        },
        {
          label: "WhatsApp",
          value: "+54 9 11 0000 0000",
          href: "https://wa.me/5491100000000",
        },
        {
          label: "Instagram",
          value: "@agencia",
          href: "https://instagram.com/agencia",
        },
        {
          label: "LinkedIn",
          value: "/company/agencia",
          href: "https://linkedin.com/company/agencia",
        },
      ],
      timeLabel: "Hora local en Buenos Aires",
    },
  },
};

const strings: Record<Locale, UiStrings> = { es };

export function getUiStrings(locale: Locale = "es"): UiStrings {
  return strings[locale];
}
