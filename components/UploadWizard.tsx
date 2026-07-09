"use client";

import { useState } from "react";
import type { WizardStep } from "@/types/upload";
import IntroScreen from "./IntroScreen";
import ExplanationScreen from "./ExplanationScreen";
import IdentityDocumentScreen from "./IdentityDocumentScreen";
import ProcuraExplanationScreen from "./ProcuraExplanationScreen";
import ProcuraUploadScreen from "./ProcuraUploadScreen";

export default function UploadWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  const goToNextStep = () => setCurrentStep((step) => step + 1);
  const goToPreviousStep = () => setCurrentStep((step) => Math.max(1, step - 1));

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-bg">
      {currentStep === 1 && <IntroScreen onStart={goToNextStep} />}
      {currentStep === 2 && (
        <ExplanationScreen onContinue={goToNextStep} onBack={goToPreviousStep} />
      )}
      {currentStep === 3 && (
        <IdentityDocumentScreen onContinue={goToNextStep} onBack={goToPreviousStep} />
      )}
      {currentStep === 4 && (
        <ProcuraExplanationScreen onContinue={goToNextStep} onBack={goToPreviousStep} />
      )}
      {currentStep === 5 && (
        <ProcuraUploadScreen onContinue={goToNextStep} onBack={goToPreviousStep} />
      )}
    </div>
  );
}
