import type { DocumentErrorType } from "@/types/upload";

export type FileValidationResult =
  | { valid: true; errorType: null; errorMessage: null }
  | { valid: false; errorType: DocumentErrorType; errorMessage: string };

const BYTES_PER_MB = 1024 * 1024;

function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex === -1 ? "sconosciuto" : fileName.slice(lastDotIndex);
}

export function validateFile(
  file: File,
  maxSizeMB: number,
  allowedTypes: string[],
): FileValidationResult {
  if (file.size === 0) {
    return {
      valid: false,
      errorType: "corrupted",
      errorMessage:
        "Il file sembra danneggiato o vuoto. Aprilo per controllare che si veda bene, poi caricalo di nuovo.",
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      errorType: "invalid-format",
      errorMessage: `Hai caricato un file ${getFileExtension(file.name)}. Serve un PDF o una foto JPEG o PNG.`,
    };
  }

  const maxSizeBytes = maxSizeMB * BYTES_PER_MB;
  if (file.size > maxSizeBytes) {
    if (file.type === "application/pdf") {
      return {
        valid: false,
        errorType: "too-large",
        errorMessage:
          "Il PDF supera i 5MB. Prova a scansionare di nuovo con una risoluzione più bassa, oppure scatta una foto del documento invece di scansionarlo.",
      };
    }

    const sizeMB = (file.size / BYTES_PER_MB).toFixed(1);
    return {
      valid: false,
      errorType: "too-large",
      errorMessage: `Il file è troppo pesante (${sizeMB} MB, il massimo è ${maxSizeMB}MB).`,
    };
  }

  return { valid: true, errorType: null, errorMessage: null };
}
