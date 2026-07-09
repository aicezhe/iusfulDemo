type NavArrowsProps = {
  onBack: () => void;
  onForward?: () => void;
};

export default function NavArrows({ onBack, onForward }: NavArrowsProps) {
  return (
    <div className="absolute inset-x-4 top-4 z-20 flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        aria-label="Torna indietro"
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-dark/5 hover:text-dark"
      >
        <ArrowIcon direction="left" />
      </button>

      {onForward && (
        <button
          type="button"
          onClick={onForward}
          aria-label="Vai avanti"
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-dark/5 hover:text-dark"
        >
          <ArrowIcon direction="right" />
        </button>
      )}
    </div>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}
