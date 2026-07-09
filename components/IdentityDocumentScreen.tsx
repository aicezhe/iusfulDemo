"use client";

import { useState } from "react";
import DocumentTypeCycler from "./DocumentTypeCycler";
import FileUploadSlot from "./FileUploadSlot";
import SuccessOverlay from "./SuccessOverlay";
import { validateFile } from "@/lib/fileValidation";
import { simulateUpload } from "@/lib/simulateUpload";
import type { DocumentState } from "@/types/upload";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const ACCEPTED_TYPES_ATTR = ACCEPTED_TYPES.join(",");
const MAX_SIZE_MB = 5;

const EMPTY_STATE: DocumentState = {
  status: "empty",
  fileName: null,
  errorMessage: null,
};

type ConfirmPhase = "idle" | "overlay" | "confirmed";

type IdentityDocumentScreenProps = {
  onContinue: () => void;
};

export default function IdentityDocumentScreen({
  onContinue,
}: IdentityDocumentScreenProps) {
  const [frontState, setFrontState] = useState<DocumentState>(EMPTY_STATE);
  const [backState, setBackState] = useState<DocumentState>(EMPTY_STATE);
  const [phase, setPhase] = useState<ConfirmPhase>("idle");
  const [showHint, setShowHint] = useState(false);

  const bothUploaded =
    frontState.status === "success" && backState.status === "success";
  const isReady = bothUploaded || phase === "confirmed";

  const handleFileSelect =
    (setState: (state: DocumentState) => void) => (file: File) => {
      const { valid, errorMessage } = validateFile(
        file,
        MAX_SIZE_MB,
        ACCEPTED_TYPES,
      );

      if (!valid) {
        setState({ status: "error", fileName: null, errorMessage });
        return;
      }

      setState({ status: "loading", fileName: null, errorMessage: null });

      simulateUpload(file)
        .then(() =>
          setState({ status: "success", fileName: file.name, errorMessage: null }),
        )
        .catch((error: Error) =>
          setState({ status: "error", fileName: null, errorMessage: error.message }),
        );
    };

  const handleButtonClick = () => {
    if (phase === "confirmed") {
      onContinue();
      return;
    }

    if (!bothUploaded) {
      setShowHint(true);
      return;
    }

    setPhase("overlay");
    setTimeout(() => setPhase("confirmed"), 800);
  };

  return (
    <div className="animate-fade-in-up relative flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      {phase === "overlay" && <SuccessOverlay message="Tutto corretto, grazie!" />}

      <div className="flex w-full max-w-md flex-col items-center gap-8 sm:max-w-lg">
        <div className="flex flex-col items-center gap-4">
          <DocumentTypeCycler />

          <div className="flex flex-col items-center gap-3">
            <h1 className="font-serif text-3xl leading-snug text-dark sm:text-4xl">
              Documento d&apos;identità
            </h1>
            <p className="max-w-sm text-sm text-muted">
              Il documento d&apos;identità è un documento ufficiale che
              dimostra chi sei. Ci serve per verificare in modo sicuro chi
              sta avviando la pratica.
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <FileUploadSlot
            label="Fronte"
            accept={ACCEPTED_TYPES_ATTR}
            documentState={frontState}
            onFileSelect={handleFileSelect(setFrontState)}
          />
          <FileUploadSlot
            label="Retro"
            accept={ACCEPTED_TYPES_ATTR}
            documentState={backState}
            onFileSelect={handleFileSelect(setBackState)}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleButtonClick}
            onMouseEnter={() => !isReady && setShowHint(true)}
            onMouseLeave={() => setShowHint(false)}
            aria-disabled={!isReady}
            className={`w-[85%] rounded-full px-10 py-3 text-base font-medium shadow-sm transition-colors sm:w-auto sm:px-14 ${
              isReady
                ? "bg-dark text-text-light hover:bg-dark/90"
                : "cursor-not-allowed bg-dark/40 text-text-light"
            }`}
          >
            {phase === "confirmed"
              ? "Ultimo passaggio — al secondo documento"
              : "Avanti"}
          </button>

          {showHint && !isReady && (
            <p className="text-xs text-muted">
              Carica entrambi i lati prima di continuare
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
