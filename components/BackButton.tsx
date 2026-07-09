type BackButtonProps = {
  onBack: () => void;
};

export default function BackButton({ onBack }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="absolute left-4 top-4 z-20 flex items-center gap-1 text-sm text-muted transition-colors hover:text-dark"
    >
      <ArrowIcon />
      Indietro
    </button>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
