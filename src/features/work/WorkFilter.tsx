"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/content/projects";
import type { ProjectCategory } from "@/types/content";

/**
 * Filtro de trabajos. Refleja la selección en la URL (?cat=) para que sea
 * compartible y navegable con atrás/adelante, sin recargar la página.
 */
export function WorkFilter({
  categories,
  allLabel,
}: {
  categories: ProjectCategory[];
  allLabel: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get("cat");

  const select = (cat: ProjectCategory | null) => {
    const next = new URLSearchParams(params.toString());
    if (cat) next.set("cat", cat);
    else next.delete("cat");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const chip = (label: string, value: ProjectCategory | null, on: boolean) => (
    <button
      key={value ?? "all"}
      type="button"
      aria-pressed={on}
      onClick={() => select(value)}
      className={cn(
        "text-label uppercase tracking-[0.2em] transition-colors duration-[var(--duration-fast)]",
        on ? "text-accent" : "text-muted hover:text-text",
      )}
    >
      {label}
    </button>
  );

  return (
    <div
      role="group"
      aria-label="Filtrar trabajos"
      className="flex flex-wrap gap-x-8 gap-y-4"
    >
      {chip(allLabel, null, !active)}
      {categories.map((cat) =>
        chip(CATEGORY_LABELS[cat], cat, active === cat),
      )}
    </div>
  );
}
