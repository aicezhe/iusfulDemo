"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import Accordion from "./Accordion";
import FileExampleDiagram from "./FileExampleDiagram";
import { compressImage } from "@/lib/compressImage";
import type { DocumentState } from "@/types/upload";

const MAX_SIZE_MB = 5;
const SLOW_UPLOAD_THRESHOLD_MS = 3000;

type FileUploadSlotProps = {
  label: string;
  documentState: DocumentState;
  onFileSelect: (file: File) => void;
  accept: string;
  previouslyUploaded?: boolean;
};

export default function FileUploadSlot({
  label,
  documentState,
  onFileSelect,
  accept,
  previouslyUploaded = false,
}: FileUploadSlotProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [isSlow, setIsSlow] = useState(false);
  const { status, fileName, errorMessage, errorType } = documentState;
  const isLoading = status === "loading";

  useEffect(() => {
    if (!isLoading) return;

    const timeoutId = setTimeout(() => setIsSlow(true), SLOW_UPLOAD_THRESHOLD_MS);
    return () => {
      clearTimeout(timeoutId);
      setIsSlow(false);
    };
  }, [isLoading]);

  const openFilePicker = () => {
    if (isLoading) return;
    fileInputRef.current?.click();
  };

  const selectFile = (file: File) => {
    setLastFile(file);
    onFileSelect(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) selectFile(file);
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (isLoading) return;
    const file = event.dataTransfer.files?.[0];
    if (file) selectFile(file);
  };

  const handleCompress = async () => {
    if (!lastFile) return;
    try {
      const compressed = await compressImage(lastFile);
      selectFile(compressed);
    } catch {
      // Compression isn't supported on this device — leave the existing error in place.
    }
  };

  const borderClass =
    status === "error"
      ? "border-warning"
      : status === "success"
        ? "border-solid border-dark"
        : isDragging
          ? "border-accent"
          : "border-muted/50";

  const backgroundClass =
    status === "success"
      ? "bg-dark/[0.08]"
      : status === "error"
        ? "bg-warning/[0.08]"
        : "bg-dark/[0.03]";

  const canCompress = errorType === "too-large" && lastFile?.type === "image/jpeg";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </span>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-disabled={isLoading}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed ${borderClass} ${backgroundClass} px-4 py-5 text-center transition-colors`}
      >
        {status === "empty" && (
          <>
            <UploadIcon />
            <p className="text-sm text-text">Trascina qui il file oppure</p>
            <button
              type="button"
              onClick={openFilePicker}
              className="rounded-full border border-dark/20 px-5 py-2 text-sm font-medium text-dark transition-colors hover:bg-dark/5"
            >
              Sfoglia
            </button>
            <p className="text-xs text-muted">PDF o JPEG · Max {MAX_SIZE_MB}MB</p>
            {previouslyUploaded && (
              <p className="text-xs text-muted">
                Caricato in precedenza — ricarica il file per continuare.
              </p>
            )}
          </>
        )}

        {status === "loading" && (
          <>
            <Spinner />
            <p className="text-sm text-text">Caricamento in corso…</p>
            {isSlow && (
              <p className="text-xs text-muted">Ci vuole un po&apos; più del solito…</p>
            )}
          </>
        )}

        {status === "success" && (
          <>
            <CheckIcon />
            <p className="max-w-full truncate text-sm font-medium text-dark">{fileName}</p>
            <button
              type="button"
              onClick={openFilePicker}
              className="rounded-full border border-dark/20 px-5 py-2 text-sm font-medium text-dark transition-colors hover:bg-dark/5"
            >
              Cambia file
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <RetryIcon />
            <p className="text-sm text-warning">{errorMessage}</p>

            {canCompress && (
              <button
                type="button"
                onClick={handleCompress}
                className="rounded-full border border-warning/40 px-5 py-2 text-sm font-medium text-warning transition-colors hover:bg-warning/5"
              >
                Comprimi automaticamente
              </button>
            )}

            <button
              type="button"
              onClick={openFilePicker}
              className="rounded-full border border-dark/20 px-5 py-2 text-sm font-medium text-dark transition-colors hover:bg-dark/5"
            >
              Sfoglia
            </button>
            <p className="text-xs text-muted">PDF o JPEG · Max {MAX_SIZE_MB}MB</p>

            {errorType === "invalid-format" && (
              <Accordion title="Il file non è JPEG o PDF? Controlla qui.">
                Guarda il nome del file: dopo il punto c&apos;è il formato. Ad esempio
                &quot;documento.pdf&quot; è un PDF, &quot;foto.jpg&quot; è una foto JPEG.
                Se vedi un&apos;altra estensione (.png, .heic, .doc...), devi convertirlo
                prima di caricarlo.
                <FileExampleDiagram highlight="format" />
              </Accordion>
            )}

            {errorType === "too-large" && (
              <Accordion title="Il file supera i 5MB? Controlla qui.">
                Sul tuo telefono o computer, apri i dettagli del file (tasto destro →
                Proprietà, o tocca e tieni premuto → Informazioni) per vedere quanto pesa.
                <FileExampleDiagram highlight="size" />
              </Accordion>
            )}
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-dark"
      aria-hidden="true"
    >
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-dark"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  );
}

function RetryIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-warning"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 1 3 6.7" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function Spinner() {
  return (
    <div
      className="h-6 w-6 animate-spin rounded-full border-2 border-muted/40 border-t-dark"
      aria-hidden="true"
    />
  );
}
