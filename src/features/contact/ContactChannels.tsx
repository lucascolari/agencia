"use client";

import { useLocalTime } from "@/hooks/useLocalTime";
import { siteConfig } from "@/config/site";
import type { ContactContent } from "@/types/content";

export function ContactChannels({
  eyebrow,
  channels,
  timeLabel,
}: {
  eyebrow: string;
  channels: ContactContent["channels"];
  timeLabel: string;
}) {
  const time = useLocalTime();

  return (
    <div>
      <p className="text-label uppercase tracking-[0.28em] text-muted">
        {eyebrow}
      </p>
      <ul className="mt-10 flex flex-col gap-6">
        {channels.map((channel) => (
          <li key={channel.label}>
            <a
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
              className="group flex items-baseline justify-between gap-6 border-b border-border py-4 transition-colors duration-[var(--duration-fast)] hover:border-text"
            >
              <span className="text-label uppercase tracking-[0.2em] text-muted">
                {channel.label}
              </span>
              <span className="text-lg text-text transition-colors group-hover:text-accent">
                {channel.value}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex items-center justify-between text-label uppercase tracking-[0.2em] text-muted">
        <span>{siteConfig.location}</span>
        <span className="tabular-nums" aria-label={timeLabel}>
          {time ?? "--:--:--"}
        </span>
      </div>
    </div>
  );
}
