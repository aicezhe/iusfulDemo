type DottedDividerProps = {
  className?: string;
};

// Thin horizontal rule with a dot in the middle — the same "line + dot" motif
// as the intro-screen dividers and the logo's "ius·ful" dot.
export default function DottedDivider({ className = "" }: DottedDividerProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-muted/40" />
      <span className="h-1 w-1 rounded-full bg-muted/60" />
      <span className="h-px flex-1 bg-muted/40" />
    </span>
  );
}
