export type Level = "iniciante" | "intermediario" | "avancado";

export interface Question {
  id: string;
  level: Level;
  statement: string;
  answer: boolean;
  explanation: string;
}

export interface Patente {
  nome: string;
  emoji: string;
  /** Faixa mínima de pontos para alcançar a patente. */
  min: number;
}

export interface RankEntry {
  name: string;
  score: number;
  patente: string;
  /** Data ISO (yyyy-mm-dd). */
  date: string;
}

export const LEVELS: Level[] = ["iniciante", "intermediario", "avancado"];

export const LEVEL_META: Record<
  Level,
  { label: string; short: string; accent: "sage" | "terracotta" | "umber" }
> = {
  iniciante: {
    label: "Iniciante",
    short: "O que é e pra que serve",
    accent: "sage",
  },
  intermediario: {
    label: "Intermediário",
    short: "Comandos, CLAUDE.md, git",
    accent: "terracotta",
  },
  avancado: {
    label: "Avançado",
    short: "Hooks, MCP, subagents, SDK",
    accent: "umber",
  },
};
