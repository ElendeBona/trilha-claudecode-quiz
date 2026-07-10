import type { ReactNode } from "react";

const CODE_RE =
  /(`[^`]+`|\b[A-Za-z0-9_.-]+\.(?:md|json|ts|tsx|js|txt)\b|\/[a-z][a-z-]*|--?[a-z][a-z-]*)/g;

/** Destaca termos de código (arquivos, /comandos, -flags) em mono — o único aceno ao terminal. */
function renderStatement(text: string): ReactNode[] {
  return text.split(CODE_RE).map((part, i) => {
    if (i % 2 === 1) {
      const clean = part.replace(/`/g, "");
      return (
        <code
          key={i}
          className="rounded border border-line bg-[#ece9e0] px-1.5 py-px font-mono text-[0.85em]"
        >
          {clean}
        </code>
      );
    }
    return part;
  });
}

export function QuestionCard({
  statement,
  revealed,
  correctAnswer,
  selected,
  onAnswer,
}: {
  statement: string;
  revealed: boolean;
  correctAnswer: boolean;
  selected: boolean | null;
  onAnswer: (value: boolean) => void;
}) {
  function stateClass(value: boolean): string {
    if (!revealed)
      return "bg-paper border-line hover:-translate-y-0.5 hover:border-espresso-soft";
    if (value === correctAnswer)
      return "bg-sage border-sage text-white";
    if (selected === value)
      return "bg-rust border-rust text-white";
    return "bg-paper border-line opacity-45";
  }

  return (
    <div className="flex flex-1 flex-col">
      <p className="mx-1 mb-2 mt-4 text-balance text-center font-display text-2xl font-medium leading-tight tracking-tight">
        {renderStatement(statement)}
      </p>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
        {[true, false].map((value) => (
          <button
            key={String(value)}
            type="button"
            disabled={revealed}
            onClick={() => onAnswer(value)}
            className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-3 py-5 text-lg font-bold transition disabled:cursor-default ${stateClass(value)}`}
          >
            {value ? "Verdadeiro" : "Falso"}
            <span className="font-mono text-[11px] font-normal opacity-70">
              tecla {value ? "V" : "F"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
