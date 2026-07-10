"use client";

import { useRef } from "react";

export const DOCUMENT_TYPES = [
  "Carta d'identità",
  "Passaporto",
  "Patente di guida",
  "Permesso di soggiorno",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

type DocumentTypeSelectorProps = {
  value: DocumentType;
  onChange: (type: DocumentType) => void;
};

// A real selector — the previous version was a decorative wheel that scrolled
// on its own and selected nothing. Mutually-exclusive options, so a radiogroup
// with roving tabindex and arrow-key navigation.
export default function DocumentTypeSelector({ value, onChange }: DocumentTypeSelectorProps) {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
    if (!forward && !backward) return;

    event.preventDefault();
    const delta = forward ? 1 : -1;
    const nextIndex = (index + delta + DOCUMENT_TYPES.length) % DOCUMENT_TYPES.length;
    onChange(DOCUMENT_TYPES[nextIndex]);
    buttonsRef.current[nextIndex]?.focus();
  };

  return (
    <div role="radiogroup" aria-label="Tipo di documento" className="grid w-full grid-cols-2 gap-2">
      {DOCUMENT_TYPES.map((type, index) => {
        const isSelected = type === value;
        return (
          <button
            key={type}
            ref={(element) => {
              buttonsRef.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(type)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            style={{ borderWidth: isSelected ? "1.5px" : "1px" }}
            className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border-solid px-3 text-center text-xs leading-tight transition-colors ${
              isSelected
                ? "border-dark bg-dark/10 font-semibold text-dark"
                : "border-muted/40 bg-transparent font-normal text-muted hover:border-dark/30"
            }`}
          >
            {isSelected && <CheckIcon />}
            {type}
          </button>
        );
      })}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-dark"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}
