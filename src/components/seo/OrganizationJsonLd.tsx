import { siteConfig, siteUrl } from "@/config/site";

/**
 * Datos estructurados JSON-LD (schema.org) de la organización. Ayudan a que los
 * buscadores entiendan quién es la agencia. Es un Server Component: se serializa
 * en el HTML sin coste de cliente.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteUrl,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Buenos Aires",
      addressCountry: "AR",
    },
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.linkedin,
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Contenido controlado (no viene de usuario): seguro de serializar.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
