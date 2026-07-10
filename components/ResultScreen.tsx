"use client";

import { useState } from "react";
import { Claudinho } from "./Claudinho";
import { Ranking } from "./Ranking";
import { getPatente } from "@/lib/scoring";
import { LEVEL_META, type Level, type RankEntry } from "@/lib/types";

export function ResultScreen({
  level,
  score,
  correctCount,
  maxStreak,
  total,
  ranking,
  playerName,
  onPlayAgain,
  onChangeLevel,
}: {
  level: Level;
  score: number;
  correctCount: number;
  maxStreak: number;
  total: number;
  ranking: RankEntry[];
  playerName: string;
  onPlayAgain: () => void;
  onChangeLevel: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const patente = getPatente(score);
  const meta = LEVEL_META[level];

  function buildShareText(): string {
    const url =
      typeof window !== "undefined" ? window.location.origin : "";
    return [
      `🎯 Quiz Claude Code — Nível ${meta.label}`,
      `${patente.emoji} ${patente.nome} | ${score.toLocaleString("pt-BR")} pts | ${correctCount}/${total} ✅`,
      `🔥 Maior streak: ${maxStreak}`,
      `Jogue em: ${url}`,
    ].join("\n");
  }

  async function handleShare() {
    const text = buildShareText();
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
    } catch {
      /* usuário cancelou o share nativo — cai para o clipboard */
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col items-center text-center">
      <div className="relative mt-4">
        <span className="animate-twinkle absolute -left-3 -top-1 text-terracotta">✦</span>
        <span
          className="animate-twinkle absolute -right-4 top-2 text-terracotta"
          style={{ animationDelay: "0.5s" }}
        >
          ✦
        </span>
        <span
          className="animate-twinkle absolute -left-5 bottom-0 text-terracotta"
          style={{ animationDelay: "0.9s" }}
        >
          ✱
        </span>
        <Claudinho size={110} mood="happy" />
      </div>

      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-espresso-soft">
        Patente conquistada
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
        {patente.nome} {patente.emoji}
      </h1>

      <p className="mt-3 font-mono text-[46px] font-bold leading-none text-terracotta">
        {score.toLocaleString("pt-BR")}{" "}
        <span className="text-base text-espresso-soft">pts</span>
      </p>
      <p className="mt-1 font-mono text-[13px] text-espresso-soft">
        {meta.label} · {correctCount}/{total} ✅ · 🔥 maior streak {maxStreak}
      </p>

      <pre className="my-5 w-full whitespace-pre-wrap rounded-2xl border border-dashed border-terracotta bg-paper px-4 py-3.5 text-left font-mono text-[12.5px] leading-relaxed text-espresso">
        {buildShareText()}
      </pre>

      <div className="flex w-full flex-col gap-2.5">
        <button
          type="button"
          onClick={handleShare}
          className="rounded-xl bg-terracotta py-4 text-base font-bold text-white transition hover:opacity-90"
        >
          {copied ? "✓ Copiado para a área de transferência" : "✱ Compartilhar resultado"}
        </button>
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-xl border-[1.5px] border-line py-3 text-sm font-semibold transition hover:border-espresso-soft"
        >
          Jogar novamente
        </button>
        <button
          type="button"
          onClick={onChangeLevel}
          className="rounded-xl border-[1.5px] border-line py-3 text-sm font-semibold transition hover:border-espresso-soft"
        >
          Trocar nível
        </button>
      </div>

      <div className="mt-6 w-full">
        <Ranking
          entries={ranking}
          highlightName={playerName}
          title={`Ranking local · ${meta.label}`}
        />
      </div>
    </div>
  );
}
