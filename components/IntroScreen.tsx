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

      <div className="-mx-6 flex w-[calc(100%+3rem)] flex-col items-center bg-white/30 px-6 py-10">
        <p className="max-w-xs font-mono text-sm leading-relaxed tracking-wide sm:max-w-sm">
          <span className="text-text/50">I tuoi documenti sono trattati</span>
          <br />
          <span className="text-text/50">in modo </span>
          <span className="font-semibold text-[#1c2536]">sicuro e riservato</span>
          <span className="text-text/50">.</span>
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
