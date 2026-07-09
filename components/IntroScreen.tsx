type IntroScreenProps = {
  onStart: () => void;
};

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="animate-fade-in-up relative flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <FullWidthDivider className="top-8" />

      <p className="font-serif text-lg tracking-wide text-dark">
        ius<span className="text-accent">·</span>ful
      </p>

      <h1 className="max-w-xs font-serif text-3xl leading-snug text-dark sm:max-w-sm sm:text-4xl">
        Due <span className="text-accent">documenti</span>,
        <br />
        senza complicazioni.
      </h1>

      <div className="flex max-w-xs items-center gap-4 rounded-2xl border border-muted/30 bg-white/40 px-5 py-4 text-left sm:max-w-sm">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15">
          <LockIcon />
        </span>
        <p className="font-mono text-sm text-text">
          I tuoi documenti sono trattati in modo{" "}
          <span className="text-accent">sicuro e riservato</span>.
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="rounded-full bg-dark px-10 py-3 font-sans text-base font-medium text-text-light transition-colors hover:bg-dark/90"
      >
        Inizia
      </button>

      <FullWidthDivider className="bottom-12" />
    </div>
  );
}

function FullWidthDivider({ className }: { className: string }) {
  return (
    <div
      className={`absolute inset-x-0 flex items-center gap-2 ${className}`}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-muted/40" />
      <span className="h-1 w-1 rounded-full bg-muted/60" />
      <span className="h-px flex-1 bg-muted/40" />
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-accent"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
