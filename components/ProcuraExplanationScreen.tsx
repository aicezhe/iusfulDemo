import FullWidthDivider from "./FullWidthDivider";
import StepIndicator from "./StepIndicator";

type ProcuraExplanationScreenProps = {
  onContinue: () => void;
};

export default function ProcuraExplanationScreen({
  onContinue,
}: ProcuraExplanationScreenProps) {
  return (
    <div className="animate-fade-in-up relative flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <FullWidthDivider className="top-8" />

      <div className="flex -translate-y-[6%] flex-col items-center gap-4">
        <StepIndicator totalSteps={2} currentStep={2} />

        <h1 className="max-w-xs font-serif text-2xl font-medium leading-snug text-dark sm:max-w-md sm:text-4xl">
          Procura alle liti
        </h1>

        <p className="mt-2 max-w-xs text-base leading-relaxed text-muted sm:max-w-sm sm:text-lg">
          Ci autorizza a seguire la tua pratica in tribunale.
          <br />
          Bastano 3 passaggi veloci.
        </p>

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
