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

  // Every screen stays mounted for the lifetime of the wizard and is only
  // hidden via CSS when it's not the current step (instead of being removed
  // from the tree). Unmounting would wipe each screen's own state — selected
  // files, upload status, download progress — so navigating back and forth
  // would silently lose what the user already did.
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-bg">
      <div className={currentStep === 1 ? "contents" : "hidden"}>
        <IntroScreen onStart={goToNextStep} />
      </div>
      <div className={currentStep === 2 ? "contents" : "hidden"}>
        <ExplanationScreen onContinue={goToNextStep} onBack={goToPreviousStep} />
      </div>
      <div className={currentStep === 3 ? "contents" : "hidden"}>
        <IdentityDocumentScreen onContinue={goToNextStep} onBack={goToPreviousStep} />
      </div>
      <div className={currentStep === 4 ? "contents" : "hidden"}>
        <ProcuraExplanationScreen onContinue={goToNextStep} onBack={goToPreviousStep} />
      </div>
      <div className={currentStep === 5 ? "contents" : "hidden"}>
        <ProcuraUploadScreen onContinue={goToNextStep} onBack={goToPreviousStep} />
      </div>
    </div>
  );
}
