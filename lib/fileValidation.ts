export type FileValidationResult = {
  valid: boolean;
  errorMessage: string | null;
};

export function validateFile(
  file: File,
  maxSizeMB: number,
  allowedTypes: string[],
): FileValidationResult {
  if (file.size === 0) {
    return {
      valid: false,
      errorMessage: "Il file sembra danneggiato. Riprova con un altro.",
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      errorMessage: "Formato non supportato. Carica un PDF o una foto (JPEG/PNG).",
    };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      errorMessage: "Il file supera i 5MB. Prova a comprimerlo o scattare una nuova foto.",
    };
  }

  return { valid: true, errorMessage: null };
}
