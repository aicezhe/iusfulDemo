"use client";

import { useEffect, useState } from "react";
import AiProcessingStatus, {
  AI_PROCESSING_DURATION_MS,
  type AiPhase,
} from "./AiProcessingStatus";
import DocumentTypeSelector, { type DocumentType } from "./DocumentTypeSelector";
import FileUploadSlot from "./FileUploadSlot";
import NavArrows from "./NavArrows";
import SuccessOverlay from "./SuccessOverlay";
import { validateFile } from "@/lib/fileValidation";
import { simulateUpload } from "@/lib/simulateUpload";
import { readDocumentStatus, saveDocumentStatus } from "@/lib/localStorage";
import type { DocumentState } from "@/types/upload";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const ACCEPTED_TYPES_ATTR = ACCEPTED_TYPES.join(",");
const MAX_SIZE_MB = 5;
// Matches the intermediate SuccessOverlay animation (see globals.css) so the
// screen advances exactly as the quick checkpoint flash fades out.
const TRANSITION_DELAY_MS = 800;

const FRONT_STORAGE_KEY = "identity-front";
const BACK_STORAGE_KEY = "identity-back";

const EMPTY_STATE: DocumentState = {
  status: "empty",
  fileName: null,
  errorMessage: null,
  errorType: null,
};

type IdentityDocumentScreenProps = {
  onContinue: () => void;
  onBack: () => void;
};

export default function IdentityDocumentScreen({
  onContinue,
  onBack,
}: IdentityDocumentScreenProps) {
  const [documentType, setDocumentType] = useState<DocumentType>("Carta d'identità");
  const [frontState, setFrontState] = useState<DocumentState>(EMPTY_STATE);
  const [backState, setBackState] = useState<DocumentState>(EMPTY_STATE);
  const [frontPreviouslyUploaded, setFrontPreviouslyUploaded] = useState(false);
  const [backPreviouslyUploaded, setBackPreviouslyUploaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [verificationPhase, setVerificationPhase] = useState<AiPhase>("idle");

  // A passport only has one relevant page (the one with the photo); every
  // other accepted document has a front and a back.
  const isSinglePage = documentType === "Passaporto";
  const frontLabel = isSinglePage ? "Pagina con la foto" : "Fronte";

  /* eslint-disable react-hooks/set-state-in-effect -- syncing from
     localStorage, only available client-side. */
  useEffect(() => {
    setFrontPreviouslyUploaded(readDocumentStatus(FRONT_STORAGE_KEY) === "success");
    setBackPreviouslyUploaded(readDocumentStatus(BACK_STORAGE_KEY) === "success");
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const allUploaded = isSinglePage
    ? frontState.status === "success"
    : frontState.status === "success" && backState.status === "success";

  // Once every required page is uploaded, run the AI-check imitation before
  // enabling the continue button — identical to the Procura screen.
  useEffect(() => {
    if (!allUploaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVerificationPhase("idle");
      return;
    }
    setVerificationPhase("processing");
    const timer = setTimeout(() => setVerificationPhase("done"), AI_PROCESSING_DURATION_MS);
    return () => clearTimeout(timer);
  }, [allUploaded]);

  const isReadyToContinue = verificationPhase === "done";

  const handleTypeChange = (type: DocumentType) => {
    if (type === documentType) return;
    // A different document means different pages — start its upload fresh.
    setDocumentType(type);
    setFrontState(EMPTY_STATE);
    setBackState(EMPTY_STATE);
    setFrontPreviouslyUploaded(false);
    setBackPreviouslyUploaded(false);
  };

  const handleFileSelect =
    (setState: (state: DocumentState) => void, storageKey: string) =>
    (file: File) => {
      const result = validateFile(file, MAX_SIZE_MB, ACCEPTED_TYPES);

      if (!result.valid) {
        setState({
          status: "error",
          fileName: null,
          errorMessage: result.errorMessage,
          errorType: result.errorType,
        });
        return;
      }

      setState({ status: "loading", fileName: null, errorMessage: null, errorType: null });

      simulateUpload(file)
        .then(() => {
          setState({
            status: "success",
            fileName: file.name,
            errorMessage: null,
            errorType: null,
          });
          saveDocumentStatus(storageKey, "success");
        })
        .catch((error: Error) =>
          setState({
            status: "error",
            fileName: null,
            errorMessage: error.message,
            errorType: "network",
          }),
        );
    };

  const handleButtonClick = () => {
    if (isTransitioning) return;

    if (!isReadyToContinue) {
      if (!allUploaded) setShowHint(true);
      return;
    }

    setIsTransitioning(true);
    setTimeout(onContinue, TRANSITION_DELAY_MS);
  };

  return (
    <div className="animate-fade-in-up relative flex min-h-dvh flex-col bg-bg">
      <NavArrows
        onBack={onBack}
        onForward={handleButtonClick}
        centerLabel="Documento 1 di 2"
      />
      {isTransitioning && <SuccessOverlay message="Tutto corretto, grazie!" />}

      <div className="flex-1 px-6 pb-6 pt-16">
        <div className="mx-auto flex w-full max-w-md flex-col items-start gap-6 text-left">
          <div className="flex flex-col items-start gap-2">
            <h1 className="font-serif text-3xl font-medium leading-snug text-dark sm:text-4xl">
              Documento d&apos;identità
            </h1>
            <p className="text-sm text-muted">
              Ci serve per verificare in modo sicuro chi sta avviando la pratica.
            </p>
          </div>

          <div className="flex w-full flex-col items-start gap-2">
            <p className="text-[13px] font-medium text-dark">Quale documento carichi?</p>
            <DocumentTypeSelector value={documentType} onChange={handleTypeChange} />
          </div>

          <div
            className={
              isSinglePage
                ? "w-full max-w-xs"
                : "grid w-full grid-cols-1 gap-4 sm:grid-cols-2"
            }
          >
            <FileUploadSlot
              label={frontLabel}
              accept={ACCEPTED_TYPES_ATTR}
              documentState={frontState}
              onFileSelect={handleFileSelect(setFrontState, FRONT_STORAGE_KEY)}
              previouslyUploaded={frontPreviouslyUploaded}
            />
            {!isSinglePage && (
              <FileUploadSlot
                label="Retro"
                accept={ACCEPTED_TYPES_ATTR}
                documentState={backState}
                onFileSelect={handleFileSelect(setBackState, BACK_STORAGE_KEY)}
                previouslyUploaded={backPreviouslyUploaded}
              />
            )}
          </div>

          {verificationPhase !== "idle" && <AiProcessingStatus phase={verificationPhase} />}
        </div>
      </div>

      <div
        className="sticky bottom-0 border-solid border-dark/15 bg-bg px-6 pt-3"
        style={{
          borderTopWidth: "0.5px",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
        }}
      >
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-1">
          {showHint && !allUploaded && (
            <p className="text-xs text-muted">
              Carica il documento prima di continuare
            </p>
          )}
          <button
            type="button"
            onClick={handleButtonClick}
            onMouseEnter={() => !allUploaded && setShowHint(true)}
            onMouseLeave={() => setShowHint(false)}
            aria-disabled={!isReadyToContinue}
            className={`flex min-h-[48px] w-full items-center justify-center rounded-full px-10 text-base font-semibold leading-none shadow-sm transition-colors ${
              isReadyToContinue
                ? "bg-dark text-text-light hover:bg-dark/90"
                : "cursor-not-allowed bg-dark/40 text-text-light"
            }`}
          >
            Avanti
          </button>
        </div>
      </div>
    </div>
  );
}
