const STORAGE_KEY_PREFIX = "iusful-upload-status:";

export function saveDocumentStatus(key: string, status: string): void {
  try {
    window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, status);
  } catch {
    // localStorage may be unavailable (private browsing, storage disabled) — safe to ignore.
  }
}

export function readDocumentStatus(key: string): string | null {
  try {
    return window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
  } catch {
    return null;
  }
}
