"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { NavItem } from "@/types/content";
import { NavLink } from "./NavLink";

interface MobileMenuProps {
  items: NavItem[];
  labels: { open: string; close: string };
  brand: string;
}

export function MobileMenu({ items, labels, brand }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-movil"
        onClick={() => setOpen(true)}
        className="text-label uppercase tracking-[0.22em] text-text"
      >
        {labels.open}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            role="dialog"
            aria-modal="true"
            aria-label={labels.open}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[var(--z-overlay)] flex flex-col bg-background px-[var(--gutter)]"
          >
            <div className="flex h-20 items-center justify-between">
              <span className="font-display text-lg font-semibold tracking-[0.08em] text-text">
                {brand}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-label uppercase tracking-[0.22em] text-text"
              >
                {labels.close}
              </button>
            </div>
            <nav
              aria-label="Principal"
              className="flex flex-1 flex-col justify-center gap-4"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.06 * index,
                    duration: 0.45,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <NavLink
                    {...item}
                    onNavigate={() => setOpen(false)}
                    className="font-display text-5xl tracking-tight"
                  />
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
