type FullWidthDividerProps = {
  className: string;
};

export default function FullWidthDivider({ className }: FullWidthDividerProps) {
  return (
    <div
      className={`absolute inset-x-0 flex items-center gap-2 ${className}`}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-muted/55" />
      <span className="h-1 w-1 rounded-full bg-muted/75" />
      <span className="h-px flex-1 bg-muted/55" />
    </div>
  );
}
