import FullWidthDivider from "./FullWidthDivider";

type ExplanationScreenProps = {
  onContinue: () => void;
};

export default function ExplanationScreen({ onContinue }: ExplanationScreenProps) {
  return (
    <div className="animate-fade-in-up relative flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <FullWidthDivider className="top-8" />

      <div className="flex -translate-y-[6%] flex-col items-center gap-8">
        <h1 className="max-w-xs font-serif text-xl leading-snug text-dark sm:max-w-lg sm:text-4xl">
          Ti guidiamo <span className="text-accent">passo dopo passo</span>
          <br />
          non serve sapere
          <br />
          nulla di legale.
        </h1>

        <p className="max-w-xs text-lg leading-relaxed text-dark/70 sm:max-w-sm">
          Per iniziare la tua pratica,
          <br />
          ci servono solo{" "}
          <span className="font-medium text-accent">2 documenti.</span>
        </p>

        <button
          type="button"
          onClick={onContinue}
          className="w-[85%] rounded-full bg-dark px-10 py-3 text-base font-medium text-text-light shadow-sm transition-colors hover:bg-dark/90 sm:w-auto sm:px-14"
        >
          Vai al caricamento documenti
        </button>
      </div>

      <FullWidthDivider className="bottom-12" />
    </div>
  );
}
