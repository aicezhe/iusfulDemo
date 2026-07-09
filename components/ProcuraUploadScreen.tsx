"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import FileUploadSlot from "./FileUploadSlot";
import NavArrows from "./NavArrows";
import StepIndicator from "./StepIndicator";
import SuccessOverlay from "./SuccessOverlay";
import { validateFile } from "@/lib/fileValidation";
import { simulateUpload } from "@/lib/simulateUpload";
import { readDocumentStatus, saveDocumentStatus } from "@/lib/localStorage";
import { downloadDummyPdf } from "@/lib/downloadDummyPdf";
import type { DocumentState } from "@/types/upload";

const ACCEPTED_TYPES = ["image/jpeg", "application/pdf"];
const ACCEPTED_TYPES_ATTR = ACCEPTED_TYPES.join(",");
const MAX_SIZE_MB = 5;
const MODULO_STORAGE_KEY = "procura-modulo";
const VERIFICATION_DELAY_MS = 2000;
const DOWNLOAD_CONFIRMATION_MS = 800;
const CONTINUE_TRANSITION_MS = 1400;

const EMPTY_STATE: DocumentState = {
  status: "empty",
  fileName: null,
  errorMessage: null,
  errorType: null,
};

type VerificationPhase = "idle" | "verifying" | "received";

type ProcuraUploadScreenProps = {
  onContinue: () => void;
  onBack: () => void;
};

export default function ProcuraUploadScreen({ onContinue, onBack }: ProcuraUploadScreenProps) {
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [showDownloadConfirmation, setShowDownloadConfirmation] = useState(false);
  const [documentState, setDocumentState] = useState<DocumentState>(EMPTY_STATE);
  const [previouslyUploaded] = useState(
    () => readDocumentStatus(MODULO_STORAGE_KEY) === "success",
  );
  const [verificationPhase, setVerificationPhase] = useState<VerificationPhase>("idle");
  const [showUploadHint, setShowUploadHint] = useState(false);
  const [showContinueHint, setShowContinueHint] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isReadyToContinue = verificationPhase === "received";
  const isStep1Done = hasDownloaded;
  const isStep2Done = documentState.status === "success";
  const isStep3Done = verificationPhase === "received";

  const handleDownloadClick = () => {
    downloadDummyPdf("procura-alle-liti.pdf");
    setHasDownloaded(true);
    setShowDownloadConfirmation(true);
    setTimeout(() => setShowDownloadConfirmation(false), DOWNLOAD_CONFIRMATION_MS);
  };

  const handleFileSelect = (file: File) => {
    setVerificationPhase("idle");

    const result = validateFile(file, MAX_SIZE_MB, ACCEPTED_TYPES);

    if (!result.valid) {
      setDocumentState({
        status: "error",
        fileName: null,
        errorMessage: result.errorMessage,
        errorType: result.errorType,
      });
      return;
    }

    setDocumentState({ status: "loading", fileName: null, errorMessage: null, errorType: null });

    simulateUpload(file)
      .then(() => {
        setDocumentState({
          status: "success",
          fileName: file.name,
          errorMessage: null,
          errorType: null,
        });
        saveDocumentStatus(MODULO_STORAGE_KEY, "success");
        setVerificationPhase("verifying");
        setTimeout(() => setVerificationPhase("received"), VERIFICATION_DELAY_MS);
      })
      .catch((error: Error) =>
        setDocumentState({
          status: "error",
          fileName: null,
          errorMessage: error.message,
          errorType: "network",
        }),
      );
  };

  const handleContinueClick = () => {
    if (isTransitioning) return;

    if (!isReadyToContinue) {
      setShowContinueHint(true);
      return;
    }

    setIsTransitioning(true);
    setTimeout(onContinue, CONTINUE_TRANSITION_MS);
  };

  return (
    <div className="animate-fade-in-up relative flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <NavArrows onBack={onBack} onForward={handleContinueClick} />
      {showDownloadConfirmation && <SuccessOverlay message="Scaricato ✓" />}
      {isTransitioning && <SuccessOverlay message="Tutto corretto, grazie!" />}

      <div className="flex w-full max-w-md flex-col items-center gap-8 sm:max-w-lg">
        <div className="flex flex-col items-center gap-3">
          <StepIndicator totalSteps={2} currentStep={2} />
          <h1 className="font-serif text-3xl font-medium leading-snug text-dark sm:text-4xl">
            Procura alle liti
          </h1>

          <div className="flex items-center gap-2" aria-hidden="true">
            <StepBadge number={1} done={isStep1Done} />
            <StepBadge number={2} done={isStep2Done} />
            <StepBadge number={3} done={isStep3Done} />
          </div>

          <p className="max-w-sm text-sm text-muted">
            Ci autorizza a seguire la tua pratica in tribunale.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-6">
          <StepRow number={1} label="Scarica il modulo" isComplete={isStep1Done}>
            <button
              type="button"
              onClick={handleDownloadClick}
              className={`flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold leading-none shadow-sm transition-colors ${
                hasDownloaded
                  ? "border border-dark/20 text-dark hover:bg-dark/5"
                  : "bg-accent text-dark hover:bg-accent/90"
              }`}
            >
              {hasDownloaded ? "Scaricato ✓ — scarica di nuovo" : "Scarica il modulo"}
            </button>
          </StepRow>

          <StepRow
            number={2}
            label={
              <>
                <span className={hasDownloaded ? "text-accent" : undefined}>Firmalo</span>, poi
                torna qui
              </>
            }
            isComplete={isStep2Done}
          >
            <p className="text-sm text-muted">
              Stampa il modulo, firmalo a mano, poi torna su questa pagina per caricarlo.
            </p>
          </StepRow>

          <StepRow number={3} label="Carica il modulo firmato" isComplete={isStep3Done}>
            <div className="w-full">
              {documentState.status === "empty" && (
                <p className="mb-2 text-xs text-muted">
                  Assicurati che il modulo sia firmato prima di caricarlo.
                </p>
              )}

              <div className="relative">
                {!hasDownloaded && (
                  <div
                    className="absolute inset-0 z-10 cursor-not-allowed"
                    onMouseEnter={() => setShowUploadHint(true)}
                    onMouseLeave={() => setShowUploadHint(false)}
                    onClick={() => setShowUploadHint(true)}
                  />
                )}
                <div className={!hasDownloaded ? "opacity-50" : ""}>
                  <FileUploadSlot
                    label="Modulo firmato"
                    accept={ACCEPTED_TYPES_ATTR}
                    documentState={documentState}
                    onFileSelect={handleFileSelect}
                    previouslyUploaded={previouslyUploaded}
                  />
                </div>
              </div>

              {!hasDownloaded && showUploadHint && (
                <p className="mt-2 text-xs text-muted">
                  Scarica il modulo prima di caricarlo
                </p>
              )}

              {verificationPhase === "verifying" && (
                <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted">
                  <Spinner />
                  Verifica in corso...
                </p>
              )}

              {verificationPhase === "received" && (
                <p className="mt-2 text-sm font-semibold text-dark">✓ Documento ricevuto</p>
              )}
            </div>
          </StepRow>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleContinueClick}
            onMouseEnter={() => !isReadyToContinue && setShowContinueHint(true)}
            onMouseLeave={() => setShowContinueHint(false)}
            aria-disabled={!isReadyToContinue}
            className={`flex w-[85%] items-center justify-center rounded-full px-10 py-3 text-base font-semibold leading-none shadow-sm transition-colors sm:w-auto sm:px-14 ${
              isReadyToContinue
                ? "bg-dark text-text-light hover:bg-dark/90"
                : "cursor-not-allowed bg-dark/40 text-text-light"
            }`}
          >
            Continua
          </button>

          {showContinueHint && !isReadyToContinue && (
            <p className="text-xs text-muted">
              Carica il modulo firmato prima di continuare
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

type StepRowProps = {
  number: number;
  label: ReactNode;
  isComplete: boolean;
  children: ReactNode;
};

function StepRow({ number, label, isComplete, children }: StepRowProps) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full max-w-xs items-center justify-between sm:max-w-sm">
        <span
          className={`text-sm font-medium ${isComplete ? "text-dark" : "text-dark/70"}`}
        >
          {number}. {label}
        </span>
        {isComplete && <CheckIcon />}
      </div>
      {children}
    </div>
  );
}

function StepBadge({ number, done }: { number: number; done: boolean }) {
  return (
    <span
      className={
        done
          ? "flex h-6 w-6 items-center justify-center rounded-full bg-dark text-xs font-medium text-text-light"
          : "flex h-6 w-6 items-center justify-center rounded-full border-2 border-dark/30 text-xs font-medium text-dark/50"
      }
    >
      {number}
    </span>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="shrink-0 text-dark"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

function Spinner() {
  return (
    <span
      className="h-3 w-3 animate-spin rounded-full border-2 border-muted/40 border-t-dark"
      aria-hidden="true"
    />
  );
}
