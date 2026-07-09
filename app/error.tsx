"use client";

import { useEffect } from "react";

const RELOAD_FLAG_KEY = "chunk-error-reload-attempted";

function isChunkLoadError(error: Error): boolean {
  return (
    error.name === "ChunkLoadError" ||
    /Loading chunk [\d]+ failed/.test(error.message) ||
    /Failed to fetch dynamically imported module/.test(error.message)
  );
}

export default function Error({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    if (!isChunkLoadError(error)) return;

    // A stale, previously cached page can reference JS chunks a newer deploy
    // has removed. Reload once to pick up the current build instead of
    // leaving the visitor stuck on a blank/broken page — guarded by
    // sessionStorage so a genuinely broken deploy doesn't reload forever.
    let alreadyReloaded = false;
    try {
      alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG_KEY) === "1";
    } catch {
      // sessionStorage unavailable (private browsing) — fall through and
      // reload once anyway; worst case is a single extra reload.
    }

    if (alreadyReloaded) return;

    try {
      sessionStorage.setItem(RELOAD_FLAG_KEY, "1");
    } catch {
      // ignore — see above
    }

    window.location.reload();
  }, [error]);

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-bg px-6 text-center">
      <p className="font-serif text-lg text-dark">Un attimo, stiamo aggiornando…</p>
    </div>
  );
}
