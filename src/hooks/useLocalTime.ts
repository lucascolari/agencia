"use client";

import { useEffect, useState } from "react";

/** Hora local en vivo (por defecto Buenos Aires). Null hasta montar en cliente. */
export function useLocalTime(
  timeZone = "America/Argentina/Buenos_Aires",
): string | null {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone,
    });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return time;
}
