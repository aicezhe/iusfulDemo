"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import type { DocumentState } from "@/types/upload";

const MAX_SIZE_MB = 5;

type FileUploadSlotProps = {
  label: string;
  documentState: DocumentState;
  onFileSelect: (file: File) => void;
  accept: string;
};

export default function FileUploadSlot({
  label,
  documentState,
  onFileSelect,
  accept,
}: FileUploadSlotProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { status, fileName, errorMessage } = documentState;

  const openFilePicker = () => fileInputRef.current?.click();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  const borderClass =
    status === "error"
      ? "border-warning"
      : status === "success"
        ? "border-solid border-dark/25"
        : isDragging
          ? "border-accent"
          : "border-muted/50";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </span>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed ${borderClass} bg-dark/[0.03] px-6 py-8 text-center transition-colors`}
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
            <p className="text-xs text-muted">
              PDF, JPEG o PNG · Max {MAX_SIZE_MB}MB
            </p>
          </>
        )}

        {status === "loading" && (
          <>
            <Spinner />
            <p className="text-sm text-text">Caricamento in corso…</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckIcon />
            <p className="max-w-full truncate text-sm text-text">{fileName}</p>
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
            <WarningIcon />
            <p className="text-sm text-warning">{errorMessage}</p>
            <button
              type="button"
              onClick={openFilePicker}
              className="rounded-full border border-dark/20 px-5 py-2 text-sm font-medium text-dark transition-colors hover:bg-dark/5"
            >
              Sfoglia
            </button>
            <p className="text-xs text-muted">
              PDF, JPEG o PNG · Max {MAX_SIZE_MB}MB
            </p>
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
      width="28"
      height="28"
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
      strokeWidth="1.5"
      className="text-dark"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-warning"
      aria-hidden="true"
    >
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.29 3.86l-8.18 14.18A1.5 1.5 0 0 0 3.4 20.3h17.2a1.5 1.5 0 0 0 1.29-2.26L13.71 3.86a1.5 1.5 0 0 0-2.42 0z" />
    </svg>
  );
}

function Spinner() {
  return (
    <div
      className="h-7 w-7 animate-spin rounded-full border-2 border-muted/40 border-t-dark"
      aria-hidden="true"
    />
  );
}
