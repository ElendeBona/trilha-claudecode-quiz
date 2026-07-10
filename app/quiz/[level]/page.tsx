"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Timer } from "@/components/Timer";
import { ScoreBoard } from "@/components/ScoreBoard";
import { QuestionCard } from "@/components/QuestionCard";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { ResultScreen } from "@/components/ResultScreen";
import { Claudinho } from "@/components/Claudinho";
import allQuestions from "@/data/questions.json";
import { pickQuestions } from "@/lib/shuffle";
import { awardPoints, getPatente, QUESTION_SECONDS } from "@/lib/scoring";
import { getPlayerName, getRanking, saveScore } from "@/lib/storage";
import {
  LEVELS,
  LEVEL_META,
  type Level,
  type Question,
  type RankEntry,
} from "@/lib/types";

const QUESTIONS = allQuestions as unknown as Question[];

type Phase = "loading" | "playing" | "feedback" | "result";

interface LastAnswer {
  correct: boolean;
  timedOut: boolean;
  awarded: number;
  selected: boolean | null;
}

interface State {
  phase: Phase;
  questions: Question[];
  index: number;
  score: number;
  streak: number;
  maxStreak: number;
  correctCount: number;
  last: LastAnswer | null;
}

type Action =
  | { type: "INIT"; questions: Question[] }
  | { type: "ANSWER"; value: boolean | null; secondsLeft: number }
  | { type: "NEXT" };

const initialState: State = {
  phase: "loading",
  questions: [],
  index: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  correctCount: 0,
  last: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT":
      return {
        ...initialState,
        phase: "playing",
        questions: action.questions,
      };

    case "ANSWER": {
      if (state.phase !== "playing") return state;
      const current = state.questions[state.index];
      const timedOut = action.value === null;
      const correct = !timedOut && action.value === current.answer;
      const streak = correct ? state.streak + 1 : 0;
      const awarded = awardPoints(correct, action.secondsLeft, streak);
      return {
        ...state,
        phase: "feedback",
        score: state.score + awarded,
        streak,
        maxStreak: Math.max(state.maxStreak, streak),
        correctCount: state.correctCount + (correct ? 1 : 0),
        last: { correct, timedOut, awarded, selected: action.value },
      };
    }

    case "NEXT": {
      const isLast = state.index + 1 >= state.questions.length;
      return isLast
        ? { ...state, phase: "result" }
        : { ...state, phase: "playing", index: state.index + 1, last: null };
    }

    default:
      return state;
  }
}

export default function QuizPage() {
  const router = useRouter();
  const params = useParams<{ level: string }>();
  const level = params.level as Level;
  const validLevel = LEVELS.includes(level);

  const [state, dispatch] = useReducer(reducer, initialState);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);
  const [ranking, setRanking] = useState<RankEntry[]>([]);
  const [playerName, setPlayerNameState] = useState("");
  const savedRef = useRef(false);

  const startGame = useCallback(() => {
    savedRef.current = false;
    dispatch({ type: "INIT", questions: pickQuestions(QUESTIONS, level) });
    setSecondsLeft(QUESTION_SECONDS);
  }, [level]);

  // Redireciona nível inválido para a home.
  useEffect(() => {
    if (!validLevel) router.replace("/");
  }, [validLevel, router]);

  // Sorteia as perguntas no cliente (evita divergência de hidratação).
  useEffect(() => {
    if (validLevel) {
      setPlayerNameState(getPlayerName());
      startGame();
    }
  }, [validLevel, startGame]);

  const answer = useCallback(
    (value: boolean | null) => {
      dispatch({ type: "ANSWER", value, secondsLeft });
    },
    [secondsLeft],
  );

  // Contagem regressiva enquanto joga.
  useEffect(() => {
    if (state.phase !== "playing") return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s <= 0 ? 0 : Math.round((s - 0.1) * 10) / 10));
    }, 100);
    return () => clearInterval(id);
  }, [state.phase, state.index]);

  // Tempo esgotado conta como erro.
  useEffect(() => {
    if (state.phase === "playing" && secondsLeft <= 0) answer(null);
  }, [secondsLeft, state.phase, answer]);

  function next() {
    const isLast = state.index + 1 >= state.questions.length;
    dispatch({ type: "NEXT" });
    if (!isLast) setSecondsLeft(QUESTION_SECONDS);
  }

  // Salva a pontuação no ranking ao terminar (uma única vez).
  useEffect(() => {
    if (state.phase !== "result" || savedRef.current) return;
    savedRef.current = true;
    const name = getPlayerName() || "Anônimo";
    const entry: RankEntry = {
      name,
      score: state.score,
      patente: getPatente(state.score).nome,
      date: new Date().toISOString().slice(0, 10),
    };
    setRanking(saveScore(level, entry).ranking);
    setPlayerNameState(name);
  }, [state.phase, state.score, level]);

  // Atalhos de teclado (V/F para responder, Enter/Espaço para avançar).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (state.phase === "playing") {
        if (e.key === "v" || e.key === "V") answer(true);
        if (e.key === "f" || e.key === "F") answer(false);
      } else if (state.phase === "feedback") {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          next();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, answer]);

  if (!validLevel) return null;

  const meta = LEVEL_META[level];
  const total = state.questions.length;

  if (state.phase === "loading" || total === 0) {
    return (
      <main className="mx-auto grid min-h-dvh w-full max-w-md place-items-center px-5">
        <div className="flex flex-col items-center gap-3">
          <Claudinho size={96} />
          <p className="font-mono text-sm text-espresso-soft">
            Sorteando 10 perguntas de {meta.label}…
          </p>
        </div>
      </main>
    );
  }

  if (state.phase === "result") {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-6">
        <ResultScreen
          level={level}
          score={state.score}
          correctCount={state.correctCount}
          maxStreak={state.maxStreak}
          total={total}
          ranking={ranking}
          playerName={playerName}
          onPlayAgain={startGame}
          onChangeLevel={() => router.push("/")}
        />
        <footer className="mt-6 pt-4 text-center text-xs text-espresso-soft">
          Criado por{" "}
          <span className="font-semibold text-terracotta-deep">
            @elen_de_bona
          </span>
        </footer>
      </main>
    );
  }

  const current = state.questions[state.index];
  const revealed = state.phase === "feedback";
  const timerMood = revealed
    ? state.last?.correct
      ? ("happy" as const)
      : ("sad" as const)
    : undefined;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-xs text-espresso-soft transition hover:text-espresso"
        >
          ← sair
        </Link>
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-espresso-soft">
          {meta.label}
        </span>
      </div>

      <ScoreBoard
        index={state.index}
        total={total}
        streak={state.streak}
        score={state.score}
      />

      <div className="mt-3 flex justify-center">
        <Timer secondsLeft={secondsLeft} mood={timerMood} />
      </div>

      <QuestionCard
        statement={current.statement}
        revealed={revealed}
        correctAnswer={current.answer}
        selected={state.last?.selected ?? null}
        onAnswer={(v) => answer(v)}
      />

      {revealed && state.last && (
        <FeedbackPanel
          correct={state.last.correct}
          timedOut={state.last.timedOut}
          correctAnswer={current.answer}
          explanation={current.explanation}
          awarded={state.last.awarded}
          isLast={state.index + 1 >= total}
          onNext={next}
        />
      )}
    </main>
  );
}
