type StepIndicatorProps = {
  totalSteps: number;
  currentStep: number;
};

export default function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  return (
    <p className="text-xs font-medium uppercase tracking-wide text-muted">
      Documento {currentStep} di {totalSteps}
    </p>
  );
}
