import FullWidthDivider from "./FullWidthDivider";

type ExplanationScreenProps = {
  onContinue: () => void;
};

export default function ExplanationScreen({ onContinue }: ExplanationScreenProps) {
  return (
    <div className="animate-fade-in-up relative flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <FullWidthDivider className="top-8" />

      <div className="flex -translate-y-[6%] flex-col items-center">
        <h1 className="max-w-xs font-serif text-xl font-medium leading-snug text-dark sm:max-w-2xl sm:text-4xl">
          Ti guidiamo <span className="italic text-accent">passo dopo passo</span>
          <br />
          non serve sapere nulla di legale.
        </h1>

        <p className="mt-6 max-w-xs text-base leading-relaxed text-muted sm:mt-8 sm:max-w-sm sm:text-lg">
          Per iniziare la tua pratica,
          <br />
          ci servono solo 2 documenti.
        </p>

        <button
          type="button"
          onClick={onContinue}
          className="mt-10 rounded-full bg-dark px-10 py-3 text-base font-semibold text-text-light shadow-sm transition-colors hover:bg-dark/90 sm:mt-12 sm:px-14"
        >
          Vai al caricamento documenti
        </button>
      </div>

      <FullWidthDivider className="bottom-12" />
    </div>
  );
}
