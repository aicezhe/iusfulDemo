"use client";

import { useEffect, useState } from "react";
import type { WizardStep } from "@/types/upload";
import { readDocumentStatus, saveDocumentStatus } from "@/lib/localStorage";
import IntroScreen from "./IntroScreen";
import ExplanationScreen from "./ExplanationScreen";
import IdentityDocumentScreen from "./IdentityDocumentScreen";
import ProcuraExplanationScreen from "./ProcuraExplanationScreen";
import ProcuraUploadScreen from "./ProcuraUploadScreen";

const WIZARD_STEP_STORAGE_KEY = "wizard-current-step";

export default function UploadWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // Server always renders step 1 (localStorage isn't available during SSR), so
  // the saved step is restored client-side after mount instead of via a lazy
  // useState initializer — otherwise the very different subtree each step
  // renders would cause a hydration mismatch.
  useEffect(() => {
    const saved = Number(readDocumentStatus(WIZARD_STEP_STORAGE_KEY));
    if (Number.isInteger(saved) && saved > 1) {
      // Syncing from localStorage, which is only available client-side; a
      // lazy useState initializer would mismatch the server-rendered step 1.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentStep(saved);
    }
  }, []);

  useEffect(() => {
    saveDocumentStatus(WIZARD_STEP_STORAGE_KEY, String(currentStep));
  }, [currentStep]);

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
