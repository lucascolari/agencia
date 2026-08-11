import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[90rem] px-[var(--gutter)]", className)}
    >
      {children}
    </div>
  );
}
