import type { RankEntry } from "@/lib/types";

export function Ranking({
  entries,
  highlightName,
  title = "Ranking local",
}: {
  entries: RankEntry[];
  highlightName?: string;
  title?: string;
}) {
  return (
    <div className="w-full text-left">
      <h4 className="mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-espresso-soft">
        {title}
      </h4>

      {entries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-5 text-center text-sm text-espresso-soft">
          Ninguém no ranking ainda. Jogue para inaugurar o topo. ✱
        </p>
      ) : (
        <ol className="flex flex-col gap-0.5">
          {entries.map((e, i) => {
            const me =
              highlightName &&
              e.name.toLowerCase() === highlightName.toLowerCase();
            return (
              <li
                key={`${e.name}-${e.date}-${i}`}
                className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm ${
                  me ? "bg-terracotta/12" : ""
                }`}
              >
                <span className="w-5 font-mono font-bold text-espresso-soft">
                  {i + 1}
                </span>
                <span className="truncate">{e.name || "Anônimo"}</span>
                <span className="ml-auto font-mono font-bold">
                  {e.score.toLocaleString("pt-BR")}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
