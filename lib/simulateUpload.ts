const MIN_DELAY_MS = 1000;
const MAX_DELAY_MS = 1500;
const FAILURE_RATE = 0.1;
const NETWORK_ERROR_MESSAGE = "Il caricamento si è interrotto. Riprova.";

// Filenames containing this marker deterministically fail with a network
// error, so the error state can be demoed/tested reliably instead of
// relying on the ~10% random failure rate below.
const DETERMINISTIC_ERROR_MARKER = "test-error";

export function simulateUpload(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);

    setTimeout(() => {
      if (file.name.includes(DETERMINISTIC_ERROR_MARKER)) {
        reject(new Error(NETWORK_ERROR_MESSAGE));
        return;
      }

      if (Math.random() < FAILURE_RATE) {
        reject(new Error(NETWORK_ERROR_MESSAGE));
        return;
      }
      resolve(file);
    }, delay);
  });
}
