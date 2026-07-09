export type WizardStep = number;

export type UploadStatus = "empty" | "loading" | "success" | "error";

export type DocumentState = {
  status: UploadStatus;
  fileName: string | null;
  errorMessage: string | null;
};
