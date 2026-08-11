import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { Loader } from "@/components/ui/Loader";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${archivo.variable} ${inter.variable}`}>
      <body>
        <Loader brand={siteConfig.name} />
        <SmoothScrollProvider>
          <Header />
          <main className="relative z-[var(--z-content)]">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
