"use client";

import { useEffect } from "react";

const UPLOADED_DOCUMENTS = ["Documento d'identità", "Procura alle liti"];

type CompletionOverlayProps = {
  onDismiss: () => void;
};

export default function CompletionOverlay({ onDismiss }: CompletionOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
    >
      {/* Three-phase darken that settles at 0.85 and holds. Under
          reduced-motion it skips straight to the held state. */}
      <div
        className="animate-completion-backdrop absolute inset-0 bg-dark opacity-[0.85] motion-reduce:animate-none"
        aria-hidden="true"
      />

      <p
        className="animate-completion-hint absolute font-serif text-sm text-text-light/80 motion-reduce:hidden"
        aria-hidden="true"
      >
        Un attimo…
      </p>

      {/* Base state is the fully-shown card; the entrance animation overrides
          it while playing, so reduced-motion (animate-none) shows it at once. */}
      <div className="animate-completion-card relative w-full max-w-sm rounded-2xl bg-bg px-8 py-10 text-center shadow-xl motion-reduce:animate-none">
        <CheckmarkBadge />

        <h2
          id="completion-title"
          className="mt-6 font-serif text-2xl font-medium text-dark"
        >
          Documenti ricevuti
        </h2>

        <ul className="mx-auto mt-6 flex w-fit flex-col gap-2.5 text-left">
          {UPLOADED_DOCUMENTS.map((document) => (
            <li key={document} className="flex items-center gap-2.5 text-sm text-dark">
              <CheckIcon />
              {document}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm leading-relaxed text-muted">
          La tua pratica è pronta per essere lavorata da un avvocato. Riceverai
          una risposta entro poche ore.
        </p>

        <button
          type="button"
          onClick={onDismiss}
          className="mt-8 rounded-full border border-dark/25 px-8 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-dark/5"
        >
          Ho capito
        </button>
      </div>
    </div>
  );
}

function CheckmarkBadge() {
  return (
    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-dark/10">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-dark"
        aria-hidden="true"
      >
        <path d="M5 12.5l4.5 4.5L19 7" />
      </svg>
    </span>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
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
