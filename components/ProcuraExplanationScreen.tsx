import FullWidthDivider from "./FullWidthDivider";
import NavArrows from "./NavArrows";
import StepIndicator from "./StepIndicator";

type ProcuraExplanationScreenProps = {
  onContinue: () => void;
  onBack: () => void;
};

export default function ProcuraExplanationScreen({
  onContinue,
  onBack,
}: ProcuraExplanationScreenProps) {
  return (
    <div className="animate-fade-in-up relative flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <NavArrows onBack={onBack} onForward={onContinue} />
      <FullWidthDivider className="top-14" />

      <div className="flex -translate-y-[6%] flex-col items-center gap-4">
        <StepIndicator totalSteps={2} currentStep={2} />

        <h1 className="max-w-xs font-serif text-2xl font-medium leading-snug text-dark sm:max-w-md sm:text-4xl">
          Procura alle liti
        </h1>

        <div className="mt-2 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <p className="max-w-xs text-base leading-relaxed text-dark sm:max-w-sm sm:text-lg">
              In pratica, ci autorizzi a rappresentarti e
            </p>
            <span className="flex flex-col items-center gap-1.5">
              <span className="font-serif text-base italic text-accent sm:text-lg">
                a parlare per te in tribunale.
              </span>
              {/* Thin green "line + dot" underline — the same decorative motif
                  as the full-width dividers on the intro screen. */}
              <span className="flex w-full items-center gap-1.5" aria-hidden="true">
                <span className="h-px flex-1 bg-dark/35" />
                <span className="h-1 w-1 rounded-full bg-dark/50" />
                <span className="h-px flex-1 bg-dark/35" />
              </span>
            </span>
          </div>

          <p className="text-sm text-muted/70">Bastano 3 passaggi veloci.</p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-10 flex items-center justify-center rounded-full bg-dark px-10 py-3 text-base font-semibold leading-none text-text-light shadow-sm transition-colors hover:bg-dark/90 sm:mt-12 sm:px-14"
        >
          Continua
        </button>
      </div>

      <FullWidthDivider className="bottom-12" />
    </div>
  );
}
