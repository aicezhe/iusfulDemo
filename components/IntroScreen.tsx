type IntroScreenProps = {
  onStart: () => void;
};

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="animate-fade-in-up flex flex-1 flex-col items-center justify-center gap-12 px-6 py-16 text-center">
      <p className="font-serif text-lg tracking-wide text-dark">
        ius<span className="text-accent">·</span>ful
      </p>

      <h1 className="max-w-xl font-serif text-3xl leading-snug text-text sm:text-4xl">
        <span className="text-accent">Due</span> documenti,{" "}
        <span className="text-accent">senza complicazioni.</span>
      </h1>

      <div className="flex max-w-md items-center gap-3 rounded-2xl border border-muted/40 bg-white/40 px-5 py-4">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="shrink-0 text-dark"
          aria-hidden="true"
        >
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        <p className="font-mono text-sm text-text">
          I tuoi documenti sono trattati in modo sicuro e riservato.
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="rounded-full bg-accent px-10 py-3 font-sans text-base font-medium text-text-light transition-colors hover:bg-accent/90"
      >
        Inizia
      </button>
    </div>
  );
}
