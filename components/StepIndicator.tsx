type StepIndicatorProps = {
  totalSteps: number;
  currentStep: number;
};

export default function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Documento {currentStep} di {totalSteps}
      </p>

      <div
        className="flex items-center justify-center gap-2"
        role="img"
        aria-label={`Documento ${currentStep} di ${totalSteps}`}
      >
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === currentStep;

          return (
            <span
              key={stepNumber}
              className={
                isCurrent
                  ? "h-2.5 w-2.5 rounded-full bg-dark"
                  : "h-2.5 w-2.5 rounded-full border-2 border-dark/40"
              }
              aria-hidden="true"
            />
          );
        })}
      </div>
    </div>
  );
}
