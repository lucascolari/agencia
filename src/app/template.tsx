"use client";

/**
 * Las transiciones entre páginas ahora las maneja la View Transitions API
 * (envuelta por next-view-transitions en el layout), con animaciones definidas
 * en globals.css y el morphing de la portada → hero del case study vía
 * `view-transition-name`. Este template queda como passthrough.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
