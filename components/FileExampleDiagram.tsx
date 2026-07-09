type FileExampleDiagramProps = {
  highlight: "format" | "size";
};

export default function FileExampleDiagram({ highlight }: FileExampleDiagramProps) {
  return (
    <div className="mt-2 rounded-xl border border-muted/40 bg-white/50 p-3">
      <p className="mb-2 text-xs font-medium text-muted">I tuoi file:</p>

      <div className="flex items-center justify-between gap-3 rounded-lg bg-dark/[0.03] px-3 py-2 text-sm text-dark">
        <span className="flex items-center gap-2">
          <FileIcon />
          <span>
            documento
            {highlight === "format" ? (
              <span className="rounded border border-accent px-1 font-semibold text-accent">
                .pdf
              </span>
            ) : (
              ".pdf"
            )}
          </span>
        </span>

        {highlight === "size" ? (
          <span className="rounded-full border-2 border-accent px-2 py-0.5 font-semibold text-accent">
            4 MB
          </span>
        ) : (
          <span className="text-muted">4 MB</span>
        )}
      </div>

      <p className="mt-2 flex items-center gap-1 text-xs font-medium text-accent">
        <ArrowIcon />
        {highlight === "format"
          ? "il formato è quello che viene dopo il punto"
          : "la dimensione del file è indicata qui"}
      </p>
    </div>
  );
}

function FileIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="shrink-0 text-muted"
      aria-hidden="true"
    >
      <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="shrink-0"
      aria-hidden="true"
    >
      <path d="M17 7L7 17" />
      <path d="M9 7h8v8" />
    </svg>
  );
}
