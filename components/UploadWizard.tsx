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

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-bg">
      {currentStep === 1 && <IntroScreen onStart={goToNextStep} />}
      {currentStep === 2 && <ExplanationScreen onContinue={goToNextStep} />}
      {currentStep === 3 && <IdentityDocumentScreen onContinue={goToNextStep} />}
      {currentStep === 4 && <ProcuraExplanationScreen onContinue={goToNextStep} />}
      {currentStep === 5 && <ProcuraUploadScreen onContinue={goToNextStep} />}
    </div>
  );
}
