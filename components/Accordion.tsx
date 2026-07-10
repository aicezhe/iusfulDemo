"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type AccordionProps = {
  title: string;
  children: ReactNode;
  borderless?: boolean;
};

export default function Accordion({ title, children, borderless = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`w-full text-left ${borderless ? "" : "border-t border-muted/30"}`}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 py-3 text-sm font-semibold text-dark"
      >
        <span>{title}</span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <div className="pb-3 text-sm leading-relaxed text-muted">{children}</div>
      )}
    </div>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`shrink-0 text-dark transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
