import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig, siteUrl } from "@/config/site";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { Loader } from "@/components/ui/Loader";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { AudioToggle } from "@/components/ui/AudioToggle";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ViewTransitions } from "next-view-transitions";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { SpaceBackground } from "@/components/3d/SpaceBackground";
import { ConsentBanner } from "@/features/consent/ConsentBanner";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteTitle = `${siteConfig.name} — ${siteConfig.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: siteConfig.name,
    title: siteTitle,
    description: siteConfig.description,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="es" className={`${archivo.variable} ${inter.variable}`}>
        <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-modal)] focus:bg-accent focus:px-4 focus:py-2 focus:text-inverse"
        >
          Saltar al contenido
        </a>
        <OrganizationJsonLd />
        <SpaceBackground />
        <Loader brand={siteConfig.name} />
        <CustomCursor />
        <SmoothScrollProvider>
          <Header />
          <main id="contenido" className="relative z-[var(--z-content)]">
            {children}
          </main>
          <Footer />
        </SmoothScrollProvider>
        <AudioToggle />
        <ConsentBanner />
        </body>
      </html>
    </ViewTransitions>
  );
}
