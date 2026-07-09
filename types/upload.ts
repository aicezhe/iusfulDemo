export type WizardStep = number;

export type UploadStatus = "empty" | "loading" | "success" | "error";

export type DocumentErrorType =
  | "invalid-format"
  | "too-large"
  | "corrupted"
  | "network";

export type DocumentState = {
  status: UploadStatus;
  fileName: string | null;
  errorMessage: string | null;
  errorType?: DocumentErrorType | null;
};
