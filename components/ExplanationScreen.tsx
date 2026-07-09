type ExplanationScreenProps = {
  onContinue: () => void;
};

export default function ExplanationScreen({ onContinue }: ExplanationScreenProps) {
  return (
    <div className="animate-fade-in-up flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <h1 className="max-w-xl font-serif text-3xl leading-snug text-dark sm:text-4xl">
        Per iniziare la tua pratica, ci servono solo 2 documenti.
      </h1>

      <p className="max-w-md text-base text-muted">
        Ti guidiamo passo dopo passo — non serve sapere nulla di legale.
      </p>

      <button
        type="button"
        onClick={onContinue}
        className="w-[85%] rounded-full bg-dark px-10 py-3 text-base font-medium text-text-light shadow-sm transition-colors hover:bg-dark/90 sm:w-auto sm:px-14"
      >
        Vai al caricamento documenti
      </button>
    </div>
  );
}
