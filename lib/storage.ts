import type { Level, RankEntry } from "./types";

const RANK_PREFIX = "quiz-cc-rank-";
const NAME_KEY = "quiz-cc-name";
const MAX_ENTRIES = 10;

function rankKey(level: Level): string {
  return `${RANK_PREFIX}${level}`;
}

function safeParse(raw: string | null): RankEntry[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as RankEntry[]) : [];
  } catch {
    return [];
  }
}

/** Top 10 do nível, ordenado por pontuação (desc). Vazio no servidor. */
export function getRanking(level: Level): RankEntry[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(rankKey(level)))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);
}

/**
 * Salva uma pontuação no ranking do nível e devolve a lista atualizada
 * (top 10) e a posição da entrada (1-indexed; -1 se ficou fora do top 10).
 */
export function saveScore(
  level: Level,
  entry: RankEntry,
): { ranking: RankEntry[]; position: number } {
  if (typeof window === "undefined") return { ranking: [entry], position: 1 };

  const updated = [...getRanking(level), entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);

  window.localStorage.setItem(rankKey(level), JSON.stringify(updated));

  const position = updated.indexOf(entry) + 1;
  return { ranking: updated, position: position === 0 ? -1 : position };
}

export function getPlayerName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(NAME_KEY) ?? "";
}

export function setPlayerName(name: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NAME_KEY, name.trim());
}
