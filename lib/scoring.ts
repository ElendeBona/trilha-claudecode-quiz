import type { Patente } from "./types";

/** Constantes de pontuação — critérios de aceite do PRD (§3.2). Não alterar. */
export const BASE_POINTS = 100;
export const SPEED_BONUS_PER_SECOND = 5;
export const MAX_SPEED_BONUS = 75;
export const STREAK_3_MULTIPLIER = 1.5;
export const STREAK_5_MULTIPLIER = 2;
export const QUESTION_SECONDS = 15;
export const QUESTIONS_PER_MATCH = 10;

/**
 * Multiplicador de streak: a partir de 3 acertos consecutivos = 1,5×;
 * a partir de 5 = 2×. `streak` é a sequência JÁ incluindo o acerto atual.
 */
export function streakMultiplier(streak: number): number {
  if (streak >= 5) return STREAK_5_MULTIPLIER;
  if (streak >= 3) return STREAK_3_MULTIPLIER;
  return 1;
}

/**
 * Pontos de uma resposta.
 * - Erro ou tempo esgotado: 0 (e a sequência é zerada por quem chama).
 * - Acerto: (100 base + bônus de velocidade) × multiplicador de streak.
 *
 * @param correct       se a resposta está certa
 * @param secondsLeft   segundos restantes no timer (0–15)
 * @param streakAfter   sequência de acertos incluindo esta resposta
 */
export function awardPoints(
  correct: boolean,
  secondsLeft: number,
  streakAfter: number,
): number {
  if (!correct) return 0;
  const seconds = Math.max(0, Math.min(QUESTION_SECONDS, Math.floor(secondsLeft)));
  const speedBonus = Math.min(MAX_SPEED_BONUS, seconds * SPEED_BONUS_PER_SECOND);
  const raw = (BASE_POINTS + speedBonus) * streakMultiplier(streakAfter);
  return Math.round(raw);
}

/** Patentes por faixa de pontuação (PRD §3.4). */
export const PATENTES: Patente[] = [
  { nome: "Claude Master", emoji: "🏆", min: 2601 },
  { nome: "Dev Assistido(a) por IA", emoji: "🤖", min: 1801 },
  { nome: "Praticante de Prompts", emoji: "✱", min: 901 },
  { nome: "Explorador(a) Curioso(a)", emoji: "🧭", min: 0 },
];

export function getPatente(score: number): Patente {
  return PATENTES.find((p) => score >= p.min) ?? PATENTES[PATENTES.length - 1];
}
