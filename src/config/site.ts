export const siteConfig = {
  name: "AGENCIA",
  tagline: "Soluciones digitales",
  description:
    "Estudio de soluciones digitales en Buenos Aires. Marcas, campañas y experiencias que dejan huella.",
  locale: "es",
  location: "Buenos Aires, Argentina",
  email: "hola@agencia.com",
  social: {
    instagram: "https://instagram.com/agencia",
    linkedin: "https://linkedin.com/company/agencia",
    whatsapp: "https://wa.me/5491100000000",
  },
} as const;

export type Locale = typeof siteConfig.locale;
