"use client";

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
// on its own and selected nothing. Mutually-exclusive options, so a radiogroup.
export default function DocumentTypeSelector({ value, onChange }: DocumentTypeSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Tipo di documento"
      className="flex w-full max-w-[260px] flex-col gap-1.5"
    >
      {DOCUMENT_TYPES.map((type) => {
        const isSelected = type === value;
        return (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(type)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              isSelected
                ? "bg-dark font-semibold text-text-light"
                : "text-muted hover:bg-dark/5"
            }`}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
}
