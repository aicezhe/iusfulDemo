const MIN_DELAY_MS = 1000;
const MAX_DELAY_MS = 1500;
const FAILURE_RATE = 0.1;

export function simulateUpload(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);

    setTimeout(() => {
      if (Math.random() < FAILURE_RATE) {
        reject(new Error("Caricamento non riuscito. Riprova."));
        return;
      }
      resolve(file);
    }, delay);
  });
}
