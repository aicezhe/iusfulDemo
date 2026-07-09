import FullWidthDivider from "./FullWidthDivider";

type IntroScreenProps = {
  onStart: () => void;
};

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="animate-fade-in-up relative flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <FullWidthDivider className="top-8" />

      <div className="flex -translate-y-[6%] flex-col items-center gap-8">
        <p className="font-serif text-lg font-medium tracking-wide text-dark">
          ius<span className="text-accent">·</span>ful
        </p>

        <h1 className="max-w-xs font-serif text-3xl font-medium leading-snug text-dark sm:max-w-sm sm:text-4xl">
          Due documenti,
          <br />
          <span className="italic text-accent">senza complicazioni.</span>
        </h1>

        <div className="relative w-full max-w-xs overflow-hidden rounded-2xl border-t border-b border-dark/15 bg-dark/[0.06] px-5 py-4 shadow-sm sm:max-w-sm">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(#1a2e28 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-3">
            <ShieldIcon />
            <p className="text-left text-sm font-normal text-dark">
              I tuoi documenti sono trattati in modo sicuro e riservato.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="w-[85%] rounded-full bg-dark px-10 py-3 text-base font-semibold text-text-light shadow-sm transition-colors hover:bg-dark/90 sm:w-auto sm:px-14"
        >
          Inizia
        </button>
      </div>

      <FullWidthDivider className="bottom-12" />
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="shrink-0 text-dark"
      aria-hidden="true"
    >
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
