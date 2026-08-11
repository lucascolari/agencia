"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Envoltorio que mide su contenedor y solo renderiza el 3D cuando tiene un
 * tamaño real. Evita el caso en que el Canvas de R3F queda en 300×150 porque el
 * ResizeObserver interno no llega a medir a tiempo. `children` recibe el ancho y
 * alto en px ya resueltos.
 */
export function MeasuredCanvas({
  children,
  className,
}: {
  children: (size: { width: number; height: number }) => React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize({ width: rect.width, height: rect.height });
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {size ? children(size) : null}
    </div>
  );
}
