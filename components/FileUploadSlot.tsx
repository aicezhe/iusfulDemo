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
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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

  // Build an object URL for image previews and always revoke it — on the next
  // file (replacement) and on unmount — so "Cambia file" never leaks memory.
  useEffect(() => {
    if (!lastFile || !lastFile.type.startsWith("image/")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(lastFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [lastFile]);

  useEffect(() => {
    if (!isPreviewOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsPreviewOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewOpen]);

  const openFilePicker = () => {
    if (isLoading) return;
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    if (isLoading) return;
    cameraInputRef.current?.click();
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
        : "bg-[#faf8f3]";

  const canCompress =
    errorType === "too-large" &&
    (lastFile?.type === "image/jpeg" || lastFile?.type === "image/png");

  return (
    <div className="flex flex-col gap-2">
      <span className="text-left text-[11px] font-medium uppercase tracking-wide text-muted">
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
            {/* Mobile-first (touch): the phone camera is the primary path. No
                upload icon here — it signified drag, absent on touch. */}
            <div className="flex w-full flex-col items-center gap-2 pointer-fine:hidden">
              <button
                type="button"
                onClick={openCamera}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-dark/10 px-6 text-sm font-semibold text-dark shadow-sm transition-colors hover:bg-dark/[0.14]"
              >
                <CameraIcon />
                Scatta una foto
              </button>
              <button
                type="button"
                onClick={openFilePicker}
                className="text-sm font-semibold text-dark underline underline-offset-2 transition-colors hover:text-dark/80"
              >
                Scegli un file
              </button>
            </div>

            {/* Pointer devices (mouse/trackpad): keep drag-and-drop, with the
                icon that signifies it. */}
            <div className="hidden flex-col items-center gap-2 pointer-fine:flex">
              <UploadIcon />
              <p className="text-sm text-text">Trascina qui il file oppure</p>
              <button
                type="button"
                onClick={openFilePicker}
                className="rounded-full border border-dark/20 px-5 py-2 text-sm font-medium text-dark transition-colors hover:bg-dark/5"
              >
                Sfoglia
              </button>
            </div>

            <p className="text-xs text-muted">PDF, JPEG o PNG · Max {MAX_SIZE_MB}MB</p>
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
            {previewUrl ? (
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                aria-label={`Ingrandisci l'anteprima di ${fileName}`}
                className="overflow-hidden rounded-lg border border-dark/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={`Anteprima di ${fileName}`}
                  className="max-h-[120px] w-auto object-contain"
                />
              </button>
            ) : (
              <PdfGlyph />
            )}

            <p className="max-w-full truncate text-sm font-medium text-dark">{fileName}</p>

            {previewUrl ? (
              <p className="text-xs text-muted">
                Riesci a leggere tutti i dati? Se l&apos;immagine è sfocata o
                scura, riscattala.
              </p>
            ) : (
              lastFile && (
                <p className="text-xs text-muted">{formatFileSize(lastFile.size)}</p>
              )
            )}

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
            <p className="text-xs text-muted">PDF, JPEG o PNG · Max {MAX_SIZE_MB}MB</p>

            {errorType === "invalid-format" && (
              <Accordion title="Il file non è JPEG o PDF? Controlla qui.">
                Guarda il nome del file: dopo il punto c&apos;è il formato. Ad esempio
                &quot;documento.pdf&quot; è un PDF, &quot;foto.jpg&quot; è una foto JPEG,
                &quot;foto.png&quot; è una foto PNG. Se vedi un&apos;altra estensione
                (.heic, .doc, .txt...), devi convertirlo prima di caricarlo.
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

      {/* Two separate inputs: `capture` can't be reliably removed at runtime
          on iOS, so the camera path gets its own element. */}
      <input
        ref={cameraInputRef}
        type="file"
        accept={accept}
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {isPreviewOpen && previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsPreviewOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={`Anteprima di ${fileName}`}
            className="max-h-full max-w-full rounded-lg object-contain"
          />
          <button
            type="button"
            onClick={() => setIsPreviewOpen(false)}
            aria-label="Chiudi anteprima"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-bg/90 text-lg text-dark"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

function CameraIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden="true"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function PdfGlyph() {
  return (
    <div
      className="flex h-[120px] w-[92px] flex-col items-center justify-center gap-1.5 rounded-lg border border-dark/15 bg-dark/[0.04]"
      aria-hidden="true"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-dark"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
      <span className="text-[10px] font-semibold tracking-wide text-muted">PDF</span>
    </div>
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
