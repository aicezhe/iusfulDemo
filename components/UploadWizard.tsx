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
const FIRST_STEP = 1;
const LAST_STEP = 5;

export default function UploadWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(FIRST_STEP);

  // Server always renders step 1 (localStorage isn't available during SSR), so
  // the saved step is restored client-side after mount instead of via a lazy
  // useState initializer — otherwise the very different subtree each step
  // renders would cause a hydration mismatch.
  useEffect(() => {
    const saved = Number(readDocumentStatus(WIZARD_STEP_STORAGE_KEY));
    if (Number.isInteger(saved) && saved > FIRST_STEP) {
      // Clamp to a real screen. A value past the last step (e.g. a stale "6"
      // written by an earlier version that advanced beyond the final screen)
      // would render nothing — a blank page that sticks across reloads because
      // the bad value is read back from localStorage every time.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentStep(Math.min(saved, LAST_STEP));
    }
  }, []);

  useEffect(() => {
    saveDocumentStatus(WIZARD_STEP_STORAGE_KEY, String(currentStep));
  }, [currentStep]);

  const goToNextStep = () => setCurrentStep((step) => Math.min(LAST_STEP, step + 1));
  const goToPreviousStep = () => setCurrentStep((step) => Math.max(FIRST_STEP, step - 1));

  // Only the current step is rendered at all — each screen's own state
  // (selected files, upload status) already persists to localStorage, so
  // remounting on navigation restores it via `previouslyUploaded`/similar
  // flags without needing to keep every screen mounted in the DOM.
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
      {currentStep === 5 && <ProcuraUploadScreen onBack={goToPreviousStep} />}
    </div>
  );
}
