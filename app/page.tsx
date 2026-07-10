"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Claudinho } from "@/components/Claudinho";
import { Ranking } from "@/components/Ranking";
import { getPlayerName, setPlayerName, getRanking } from "@/lib/storage";
import { LEVELS, LEVEL_META, type Level, type RankEntry } from "@/lib/types";

const ACCENT_BG: Record<string, string> = {
  sage: "bg-sage",
  terracotta: "bg-terracotta",
  umber: "bg-umber",
};

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [rankLevel, setRankLevel] = useState<Level>("iniciante");
  const [ranking, setRanking] = useState<RankEntry[]>([]);

  useEffect(() => {
    setName(getPlayerName());
  }, []);

  useEffect(() => {
    setRanking(getRanking(rankLevel));
  }, [rankLevel]);

  function start(level: Level) {
    setPlayerName(name);
    router.push(`/quiz/${level}`);
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-10">
      <header className="flex flex-col items-center gap-3 text-center">
        <Claudinho size={112} />
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-terracotta-deep">
          Sabedoria Operacional × Claude Code
        </p>
        <h1 className="font-display text-[38px] font-semibold leading-[1.02] tracking-tight">
          Você domina o{" "}
          <em className="italic text-terracotta">Claude&nbsp;Code</em>?
        </h1>
        <p className="max-w-[30ch] text-espresso-soft">
          Verdadeiro ou Falso, 15 segundos por pergunta. Escolha seu nível.
        </p>
      </header>

      <div className="mt-6">
        <label
          htmlFor="player-name"
          className="mb-1.5 block text-xs font-semibold tracking-wide text-espresso-soft"
        >
          Seu nome no ranking
        </label>
        <input
          id="player-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          placeholder="Digite seu nome"
          className="w-full rounded-2xl border-[1.5px] border-line bg-paper px-4 py-3.5 text-base outline-none transition focus:border-terracotta"
        />
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {LEVELS.map((level) => {
          const meta = LEVEL_META[level];
          return (
            <button
              key={level}
              type="button"
              onClick={() => start(level)}
              className="flex items-center gap-3.5 rounded-2xl border-[1.5px] border-line bg-paper px-4 py-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-10px_rgba(38,34,32,0.3)]"
            >
              <span
                className={`grid size-8 flex-none place-items-center rounded-lg text-lg font-bold text-white ${ACCENT_BG[meta.accent]}`}
              >
                ✱
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-bold">{meta.label}</span>
                <span className="block text-[12.5px] text-espresso-soft">
                  {meta.short}
                </span>
              </span>
              <span className="text-lg text-espresso-soft">→</span>
            </button>
          );
        })}
      </div>

      <section className="mt-8">
        <div className="mb-3 flex gap-1 rounded-full bg-paper p-1 text-center">
          {LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setRankLevel(level)}
              className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition ${
                rankLevel === level
                  ? "bg-terracotta text-white"
                  : "text-espresso-soft"
              }`}
            >
              {LEVEL_META[level].label}
            </button>
          ))}
        </div>
        <Ranking entries={ranking} highlightName={name} title="Ranking local" />
      </section>

      <footer className="mt-auto pt-8 text-center text-xs text-espresso-soft">
        Criado por{" "}
        <span className="font-semibold text-terracotta-deep">@elen_de_bona</span>
      </footer>
    </main>
  );
}
