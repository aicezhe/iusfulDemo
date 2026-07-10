"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Accordion from "./Accordion";
import AiProcessingStatus, {
  AI_PROCESSING_DURATION_MS,
  type AiPhase,
} from "./AiProcessingStatus";
import CompletionOverlay from "./CompletionOverlay";
import DottedDivider from "./DottedDivider";
import FileUploadSlot from "./FileUploadSlot";
import NavArrows from "./NavArrows";
import StepIndicator from "./StepIndicator";
import SuccessOverlay from "./SuccessOverlay";
import { validateFile } from "@/lib/fileValidation";
import { simulateUpload } from "@/lib/simulateUpload";
import { readDocumentStatus, saveDocumentStatus } from "@/lib/localStorage";
import type { DocumentState } from "@/types/upload";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const ACCEPTED_TYPES_ATTR = ACCEPTED_TYPES.join(",");
const MAX_SIZE_MB = 5;
// A real static file (served from /public) linked via a plain anchor is the
// only reliable way to hand the PDF to iOS Safari — it ignores programmatic
// blob/data-URL downloads triggered by a synthetic click.
const MODULO_FILE_PATH = "/procura-alle-liti.pdf";
const MODULO_STORAGE_KEY = "procura-modulo";
const DOWNLOAD_STORAGE_KEY = "procura-downloaded";
const DOWNLOAD_CONFIRMATION_MS = 800;

const EMPTY_STATE: DocumentState = {
  status: "empty",
  fileName: null,
  errorMessage: null,
  errorType: null,
};

type StepStatus = "upcoming" | "active" | "completed";

type ProcuraUploadScreenProps = {
  onBack: () => void;
};

export default function ProcuraUploadScreen({ onBack }: ProcuraUploadScreenProps) {
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [alreadyHasForm, setAlreadyHasForm] = useState(false);
  // Signing happens off-screen (printer, Files app, pen), so nothing in the app
  // can observe it — the user confirms it explicitly. Deliberately NOT persisted:
  // a "signed" flag restored with no file behind it would be phantom state.
  const [procuraSigned, setProcuraSigned] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [showDownloadConfirmation, setShowDownloadConfirmation] = useState(false);
  const [documentState, setDocumentState] = useState<DocumentState>(EMPTY_STATE);
  const [previouslyUploaded, setPreviouslyUploaded] = useState(false);
  const [verificationPhase, setVerificationPhase] = useState<AiPhase>("idle");
  const [showUploadHint, setShowUploadHint] = useState(false);
  const [showContinueHint, setShowContinueHint] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // localStorage is only available client-side (the server renders defaults),
  // so its values are read after mount rather than via a lazy useState
  // initializer, which would mismatch the server render and break hydration.
  /* eslint-disable react-hooks/set-state-in-effect -- syncing from
     localStorage, only available client-side; see comment above. */
  useEffect(() => {
    setHasDownloaded(readDocumentStatus(DOWNLOAD_STORAGE_KEY) === "done");
    setPreviouslyUploaded(readDocumentStatus(MODULO_STORAGE_KEY) === "success");
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const isReadyToContinue = verificationPhase === "done";

  // Sequence: 1 download → 2 confirm signed → 3 upload. Each step is completed by
  // an explicit user action; step 2 is NEVER inferred from a file existing in
  // step 3. The upload slot opens only once the user confirms they've signed
  // (checkbox), or declares up front they already have a signed form.
  const step1Done = hasDownloaded || alreadyHasForm;
  const step2Done = procuraSigned || alreadyHasForm;
  const canUpload = step2Done;

  const stepCompletion = [step1Done, step2Done, verificationPhase === "done"];
  const activeStepIndex = stepCompletion.findIndex((done) => !done);
  const stepStatusFor = (index: number): StepStatus => {
    if (stepCompletion[index]) return "completed";
    if (index === activeStepIndex) return "active";
    return "upcoming";
  };

  const handleDownloadClick = () => {
    // The anchor performs the actual download/open natively — this only
    // records progress (persisted so returning keeps step 3 unlocked) and
    // shows a brief confirmation. Never gate the flow on the download itself,
    // since iOS Safari opens the PDF in its viewer rather than saving it.
    setHasDownloaded(true);
    saveDocumentStatus(DOWNLOAD_STORAGE_KEY, "done");
    setShowDownloadConfirmation(true);
    setTimeout(() => setShowDownloadConfirmation(false), DOWNLOAD_CONFIRMATION_MS);
  };

  const UPLOAD_UNLOCKED_MESSAGE =
    "Modulo confermato come firmato. Ora puoi caricarlo qui sotto.";

  const handleSignedToggle = (checked: boolean) => {
    setProcuraSigned(checked);
    if (checked) {
      setAnnouncement(UPLOAD_UNLOCKED_MESSAGE);
      return;
    }
    // Unchecking says the premise changed: there's nothing signed to upload.
    // Re-lock step 3 and discard any file already sitting there.
    setAlreadyHasForm(false);
    setDocumentState(EMPTY_STATE);
    setVerificationPhase("idle");
    setAnnouncement("");
  };

  const handleAlreadyHasForm = () => {
    setAlreadyHasForm(true);
    setAnnouncement(UPLOAD_UNLOCKED_MESSAGE);
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
        setVerificationPhase("processing");
        setTimeout(() => setVerificationPhase("done"), AI_PROCESSING_DURATION_MS);
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
    if (showCompletion) return;

    if (!isReadyToContinue) {
      setShowContinueHint(true);
      return;
    }

    // This is the last step of the wizard — there is no next screen. The
    // completion overlay is the culmination: it stays until dismissed and
    // then reveals the finished page underneath.
    setShowCompletion(true);
  };

  return (
    <div className="animate-fade-in-up relative flex flex-1 flex-col items-start justify-center px-6 py-16 text-left">
      <NavArrows onBack={onBack} onForward={handleContinueClick} />
      {showDownloadConfirmation && <SuccessOverlay message="Scaricato ✓" />}
      {showCompletion && <CompletionOverlay onDismiss={() => setShowCompletion(false)} />}

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <div className="mx-auto flex w-full max-w-md flex-col items-start gap-8 sm:max-w-lg">
        <div className="flex flex-col items-start gap-3">
          <StepIndicator totalSteps={2} currentStep={2} />
          <h1 className="font-serif text-3xl font-medium leading-snug text-dark sm:text-4xl">
            Procura alle liti
          </h1>

          <div className="flex items-center gap-2" aria-hidden="true">
            <StepBadge number={1} status={stepStatusFor(0)} />
            <StepBadge number={2} status={stepStatusFor(1)} />
            <StepBadge number={3} status={stepStatusFor(2)} />
          </div>

          <p className="max-w-sm text-sm text-muted">
            Ci autorizza a seguire la tua pratica in tribunale.
          </p>
        </div>

        <div className="flex w-full flex-col items-start gap-6">
          <StepRow number={1} label="Scarica il modulo" status={stepStatusFor(0)}>
            <a
              href={MODULO_FILE_PATH}
              download="procura-alle-liti.pdf"
              target="_blank"
              rel="noopener"
              onClick={handleDownloadClick}
              className={`inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold leading-none shadow-sm transition-colors ${
                hasDownloaded
                  ? "border border-dark/20 text-dark hover:bg-dark/5"
                  : "bg-accent text-text-light hover:bg-accent/90"
              }`}
            >
              {hasDownloaded ? "Scaricato ✓ — scarica di nuovo" : "Scarica il modulo"}
            </a>
            <p className="mt-2 text-xs text-muted">
              Su telefono il modulo si apre in una nuova scheda: salvalo con
              l&apos;icona Condividi, poi torna qui per caricarlo.
            </p>
            {!canUpload && (
              <button
                type="button"
                onClick={handleAlreadyHasForm}
                className="mt-1 text-xs text-muted underline underline-offset-2 transition-colors hover:text-dark"
              >
                Ho già il modulo firmato
              </button>
            )}
          </StepRow>

          <DottedDivider className="w-full max-w-xs sm:max-w-sm" />

          <StepRow number={2} label="Firmalo" status={stepStatusFor(1)}>
            <p className="text-sm text-muted">
              Stampalo e firmalo a mano, oppure firmalo direttamente sul telefono.
            </p>
            <div className="w-full max-w-xs sm:max-w-sm">
              <Accordion title="Come firmo il PDF dal telefono?" borderless>
                Su iPhone: apri il PDF nell&apos;app File, tocca l&apos;icona della
                penna in alto a destra, poi il &quot;+&quot; e scegli Firma.
                <br />
                Su Android: apri il PDF con Adobe Acrobat Reader, tocca la penna,
                poi Compila e firma.
              </Accordion>
            </div>

            <label className="mt-1 flex min-h-[44px] cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={step2Done}
                disabled={!step1Done}
                onChange={(event) => handleSignedToggle(event.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                style={{ borderWidth: "1.5px", borderRadius: "var(--radius)" }}
                className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center border-solid transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-dark/40 peer-focus-visible:ring-offset-1 ${
                  step2Done ? "border-dark bg-dark" : "border-muted/50 bg-transparent"
                }`}
              >
                {step2Done && <CheckGlyph />}
              </span>
              <span className={`text-sm ${step1Done ? "text-dark" : "text-muted"}`}>
                Ho firmato il modulo
              </span>
            </label>
          </StepRow>

          <DottedDivider className="w-full max-w-xs sm:max-w-sm" />

          <StepRow number={3} label="Carica il modulo firmato" status={stepStatusFor(2)}>
            <div className="w-full">
              <div className="relative">
                {!canUpload && (
                  <div
                    className="absolute inset-0 z-10 cursor-not-allowed"
                    onMouseEnter={() => setShowUploadHint(true)}
                    onMouseLeave={() => setShowUploadHint(false)}
                    onClick={() => setShowUploadHint(true)}
                  />
                )}
                <div className={!canUpload ? "opacity-50" : ""}>
                  <FileUploadSlot
                    label="Modulo firmato"
                    accept={ACCEPTED_TYPES_ATTR}
                    documentState={documentState}
                    onFileSelect={handleFileSelect}
                    previouslyUploaded={previouslyUploaded}
                  />
                </div>
              </div>

              {!canUpload && showUploadHint && (
                <p className="mt-2 text-xs text-muted">
                  Conferma di aver firmato il modulo prima di caricarlo
                </p>
              )}

              {verificationPhase !== "idle" && (
                <div className="mt-2">
                  <AiProcessingStatus phase={verificationPhase} />
                </div>
              )}
            </div>
          </StepRow>
        </div>

        <div className="flex w-full flex-col items-start gap-2">
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

const STEP_LABEL_COLOR: Record<StepStatus, string> = {
  upcoming: "text-muted",
  active: "text-accent",
  completed: "text-dark",
};

type StepRowProps = {
  number: number;
  label: ReactNode;
  status: StepStatus;
  children: ReactNode;
};

function StepRow({ number, label, status, children }: StepRowProps) {
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="flex w-full max-w-xs items-center justify-between sm:max-w-sm">
        <span className={`text-sm font-semibold ${STEP_LABEL_COLOR[status]}`}>
          {number}. {label}
        </span>
        {status === "completed" && <CheckIcon />}
      </div>
      {children}
    </div>
  );
}

const STEP_BADGE_COLOR: Record<StepStatus, string> = {
  upcoming: "border-2 border-dark/25 text-dark/40",
  active: "border-2 border-accent text-accent",
  completed: "border-2 border-dark bg-dark text-text-light",
};

function StepBadge({ number, status }: { number: number; status: StepStatus }) {
  return (
    <span
      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${STEP_BADGE_COLOR[status]}`}
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

function CheckGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-light"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}
