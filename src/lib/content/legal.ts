export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalPage {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  updated: string;
  sections: LegalSection[];
}

export const consentCopy = {
  title: "Cookies",
  body: "Usamos cookies necesarias para que el sitio funcione y, con tu permiso, cookies de analítica para entender cómo se usa. Vos elegís.",
  categories: {
    necessary: {
      label: "Necesarias",
      description: "Imprescindibles para el funcionamiento. Siempre activas.",
    },
    analytics: {
      label: "Analítica",
      description: "Nos ayudan a medir y mejorar la experiencia.",
    },
    marketing: {
      label: "Marketing",
      description: "Permiten personalizar comunicaciones y campañas.",
    },
  },
  acceptAll: "Aceptar todo",
  rejectAll: "Rechazar opcionales",
  save: "Guardar preferencias",
  settings: "Configurar",
} as const;

// Nota: textos legales de base. El estudio del cliente debe validarlos con su
// asesor legal antes de publicar. Estructura y placeholders reales.
export const legalPages: Record<
  "privacidad" | "cookies" | "terminos",
  LegalPage
> = {
  privacidad: {
    meta: {
      title: "Política de privacidad",
      description:
        "Cómo tratamos tus datos personales cuando visitás el sitio o nos contactás.",
    },
    eyebrow: "Legal",
    title: "Política de privacidad",
    updated: "Última actualización: 10/08/2026",
    sections: [
      {
        heading: "Qué datos recolectamos",
        body: "Recolectamos únicamente los datos que nos dejás al completar el formulario de contacto (nombre, empresa, email y la descripción de tu proyecto) y datos técnicos anónimos de navegación cuando prestás tu consentimiento.",
      },
      {
        heading: "Para qué los usamos",
        body: "Usamos tus datos para responder tu consulta, evaluar tu proyecto y, si corresponde, coordinar una propuesta. No los vendemos ni los cedemos a terceros con fines comerciales.",
      },
      {
        heading: "Tus derechos",
        body: "Podés solicitar acceder, rectificar o eliminar tus datos en cualquier momento escribiéndonos. Atendemos los pedidos dentro de los plazos que fija la normativa vigente.",
      },
      {
        heading: "Contacto",
        body: "Ante cualquier duda sobre el tratamiento de tus datos, escribinos a hola@gular.com.",
      },
    ],
  },
  cookies: {
    meta: {
      title: "Política de cookies",
      description:
        "Qué cookies usamos, para qué, y cómo podés gestionarlas.",
    },
    eyebrow: "Legal",
    title: "Política de cookies",
    updated: "Última actualización: 10/08/2026",
    sections: [
      {
        heading: "Qué son",
        body: "Las cookies son pequeños archivos que se guardan en tu dispositivo para recordar información entre visitas.",
      },
      {
        heading: "Cuáles usamos",
        body: "Cookies necesarias (imprescindibles para el funcionamiento), de analítica (para medir el uso, solo con tu permiso) y de marketing (para personalizar comunicaciones, solo con tu permiso).",
      },
      {
        heading: "Cómo gestionarlas",
        body: "Podés cambiar tu elección cuando quieras desde el panel de preferencias del sitio, o borrando las cookies desde tu navegador.",
      },
    ],
  },
  terminos: {
    meta: {
      title: "Términos y condiciones",
      description: "Las reglas de uso de este sitio.",
    },
    eyebrow: "Legal",
    title: "Términos y condiciones",
    updated: "Última actualización: 10/08/2026",
    sections: [
      {
        heading: "Uso del sitio",
        body: "El contenido de este sitio es informativo. Al navegarlo aceptás usarlo de buena fe y conforme a la ley.",
      },
      {
        heading: "Propiedad intelectual",
        body: "Los trabajos, marcas y contenidos mostrados pertenecen a sus respectivos titulares. No está permitido reproducirlos sin autorización.",
      },
      {
        heading: "Responsabilidad",
        body: "Hacemos nuestro mejor esfuerzo para que la información sea correcta y el sitio esté disponible, pero no garantizamos ausencia total de errores o interrupciones.",
      },
    ],
  },
};
