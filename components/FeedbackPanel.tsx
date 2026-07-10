export function FeedbackPanel({
  correct,
  timedOut,
  correctAnswer,
  explanation,
  awarded,
  isLast,
  onNext,
}: {
  correct: boolean;
  timedOut: boolean;
  correctAnswer: boolean;
  explanation: string;
  awarded: number;
  isLast: boolean;
  onNext: () => void;
}) {
  const verdict = correct
    ? `Acertou!  +${awarded} pts`
    : timedOut
      ? `Tempo esgotado! Era ${correctAnswer ? "Verdadeiro" : "Falso"}`
      : `Ops! A resposta era ${correctAnswer ? "Verdadeiro" : "Falso"}`;

  return (
    <div className="animate-rise mt-4">
      <div
        className={`rounded-2xl border p-4 ${
          correct
            ? "border-sage/40 bg-sage/15"
            : "border-rust/40 bg-rust/10"
        }`}
      >
        <div
          className={`mb-1 flex items-center gap-2 font-bold ${correct ? "text-sage" : "text-rust"}`}
        >
          <span aria-hidden="true">✱</span>
          <span>{verdict}</span>
        </div>
        <p className="text-sm leading-relaxed text-espresso-soft">{explanation}</p>
      </div>

      <button
        type="button"
        onClick={onNext}
        autoFocus
        className="mt-3 w-full rounded-xl bg-espresso py-4 text-base font-bold text-cream transition hover:opacity-90"
      >
        {isLast ? "Ver resultado →" : "Próxima →"}
      </button>
    </div>
  );
}
