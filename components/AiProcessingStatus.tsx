export type AiPhase = "idle" | "processing" | "done";

// Shared so the AI-check imitation is identical on both upload screens.
export const AI_PROCESSING_DURATION_MS = 2200;

type AiProcessingStatusProps = {
  phase: AiPhase;
};

export default function AiProcessingStatus({ phase }: AiProcessingStatusProps) {
  if (phase === "processing") {
    return (
      <p className="flex items-center justify-center gap-2 text-sm text-muted">
        <Spinner />
        I documenti vengono elaborati dall&apos;IA…
      </p>
    );
  }

  if (phase === "done") {
    return <p className="text-sm font-semibold text-dark">✓ Documento ricevuto</p>;
  }

  return null;
}

function Spinner() {
  return (
    <span
      className="h-3 w-3 animate-spin rounded-full border-2 border-muted/40 border-t-dark"
      aria-hidden="true"
    />
  );
}
