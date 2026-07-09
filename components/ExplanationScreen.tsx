type ExplanationScreenProps = {
  onContinue: () => void;
};

export default function ExplanationScreen({ onContinue }: ExplanationScreenProps) {
  return (
    <div className="animate-fade-in-up flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <h1 className="max-w-xl font-serif text-3xl leading-snug text-text sm:text-4xl">
        Per iniziare la tua pratica, ci servono solo 2 documenti.
      </h1>

      <p className="max-w-md text-base text-muted">
        Ti guidiamo passo dopo passo — non serve sapere nulla di legale.
      </p>

      <button
        type="button"
        onClick={onContinue}
        className="rounded-full bg-accent px-10 py-3 font-sans text-base font-medium text-text-light transition-colors hover:bg-accent/90"
      >
        Vai al caricamento documenti
      </button>
    </div>
  );
}
