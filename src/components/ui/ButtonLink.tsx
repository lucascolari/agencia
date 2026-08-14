import { Link } from "next-view-transitions";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/motion/Magnetic";

export function ButtonLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Magnetic>
      <Link
        href={href}
        className={cn(
          "inline-flex items-center gap-3 border border-border px-7 py-4",
          "text-label uppercase tracking-[0.22em] text-text",
          "transition-colors duration-[var(--duration-fast)]",
          "hover:border-accent hover:text-accent",
          className,
        )}
      >
        {children}
      </Link>
    </Magnetic>
  );
}
