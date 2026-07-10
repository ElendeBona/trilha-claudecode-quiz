export function ScoreBoard({
  index,
  total,
  streak,
  score,
}: {
  index: number;
  total: number;
  streak: number;
  score: number;
}) {
  const progress = (index / total) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs tracking-wide text-espresso-soft">
        {String(index + 1).padStart(2, "0")}/{total}
      </span>

      <span className="mx-1 h-1.5 flex-1 overflow-hidden rounded-full bg-line">
        <span
          className="block h-full rounded-full bg-terracotta transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </span>

      {streak >= 2 ? (
        <span className="whitespace-nowrap font-mono text-sm font-bold text-terracotta-deep">
          🔥 x{streak}
        </span>
      ) : (
        <span className="whitespace-nowrap font-mono text-sm font-bold text-espresso-soft">
          {score.toLocaleString("pt-BR")}
        </span>
      )}
    </div>
  );
}
