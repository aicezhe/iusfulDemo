type SuccessOverlayProps = {
  message: string;
};

export default function SuccessOverlay({ message }: SuccessOverlayProps) {
  return (
    <div
      className="animate-success-overlay absolute inset-0 z-10 flex items-center justify-center bg-dark/90 text-text-light"
      role="status"
    >
      <p className="font-serif text-lg">{message}</p>
    </div>
  );
}
