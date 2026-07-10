import type { Level, Question } from "./types";
import { QUESTIONS_PER_MATCH } from "./scoring";

/** Fisher–Yates puro: retorna um novo array embaralhado, sem mutar o original. */
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Sorteia as perguntas de uma partida: filtra pelo nível, embaralha e
 * pega as primeiras N (10 por padrão). As alternativas já vêm embaralhadas.
 */
export function pickQuestions(
  all: readonly Question[],
  level: Level,
  count: number = QUESTIONS_PER_MATCH,
): Question[] {
  const pool = all.filter((q) => q.level === level);
  return shuffle(pool).slice(0, count);
}
