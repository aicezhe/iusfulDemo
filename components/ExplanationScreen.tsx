import FullWidthDivider from "./FullWidthDivider";
import NavArrows from "./NavArrows";

type ExplanationScreenProps = {
  onContinue: () => void;
  onBack: () => void;
};

export default function ExplanationScreen({ onContinue, onBack }: ExplanationScreenProps) {
  return (
    <div className="animate-fade-in-up relative flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <NavArrows onBack={onBack} onForward={onContinue} />
      <FullWidthDivider className="top-14" />

      <div className="flex -translate-y-[6%] flex-col items-center">
        <h1 className="max-w-xs font-serif text-xl font-medium leading-snug text-dark sm:max-w-2xl sm:text-4xl">
          Ti guidiamo <span className="italic text-accent">passo dopo passo</span>
          <br />
          non serve sapere nulla di legale.
        </h1>

        <button
          type="button"
          onClick={onContinue}
          className="mt-6 rounded-full bg-dark px-10 py-3 text-base font-semibold text-text-light shadow-sm transition-colors hover:bg-dark/90 sm:mt-8 sm:px-14"
        >
          Vai al caricamento documenti
        </button>

        <p className="mt-14 max-w-[320px] whitespace-nowrap text-xs text-muted sm:mt-16 sm:max-w-none sm:text-sm">
          Per iniziare la tua pratica, ci servono solo 2 documenti.
        </p>
      </div>

      <FullWidthDivider className="bottom-12" />
    </div>
  );
}
