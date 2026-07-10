import { Claudinho, type Mood } from "./Claudinho";
import { QUESTION_SECONDS } from "@/lib/scoring";

const RADIUS = 54;
const CIRC = 2 * Math.PI * RADIUS;

/**
 * Anel de contagem regressiva ao redor do Claudinho.
 * Nos últimos 5s o anel fica rust e o mascote entra em modo "urgent".
 */
export function Timer({
  secondsLeft,
  size = 150,
  total = QUESTION_SECONDS,
  mood,
}: {
  secondsLeft: number;
  size?: number;
  total?: number;
  mood?: Mood;
}) {
  const frac = Math.max(0, Math.min(1, secondsLeft / total));
  const offset = CIRC * (1 - frac);
  const urgent = secondsLeft <= 5 && secondsLeft > 0;
  const displayMood: Mood = mood ?? (urgent ? "urgent" : "idle");

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          className="stroke-line"
          strokeWidth="7"
        />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          className={urgent ? "stroke-rust" : "stroke-terracotta"}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.15s linear, stroke 0.3s" }}
        />
      </svg>

      <Claudinho size={size * 0.62} mood={displayMood} />

      <span
        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border bg-paper px-2 py-px font-mono text-sm font-bold ${
          urgent ? "border-rust text-rust" : "border-line text-espresso-soft"
        }`}
        aria-live="polite"
      >
        {Math.ceil(Math.max(0, secondsLeft))}s
      </span>
    </div>
  );
}
