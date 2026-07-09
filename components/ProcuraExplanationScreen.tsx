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
          <p className="max-w-xs text-base leading-relaxed text-muted sm:max-w-sm sm:text-lg">
            Ci autorizza a seguire
            <br />
            <span className="font-medium text-dark underline decoration-accent decoration-2 underline-offset-4">
              la tua pratica in tribunale.
            </span>
          </p>

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
