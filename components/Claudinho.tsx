import type { CSSProperties } from "react";

export type Mood = "idle" | "happy" | "sad" | "urgent";

const RAY_COUNT = 12;

const MOOD_ANIM: Record<Mood, string> = {
  idle: "animate-breathe",
  happy: "animate-bounce-once",
  sad: "animate-droop",
  urgent: "animate-vibrate",
};

const MOOD_COLOR: Record<Mood, string> = {
  idle: "text-terracotta",
  happy: "text-terracotta",
  sad: "text-espresso-soft",
  urgent: "text-rust",
};

/**
 * Claudinho ✱ — mascote do quiz: o spark do Claude com olhinhos.
 * É a fusão do ícone ✱ com o boneco do Claude exigidos pela identidade.
 */
export function Claudinho({
  size = 120,
  mood = "idle",
  className = "",
}: {
  size?: number;
  mood?: Mood;
  className?: string;
}) {
  const eyesClosed = mood === "sad";
  const style: CSSProperties = { width: size, height: size };

  return (
    <div
      className={`grid place-items-center ${MOOD_COLOR[mood]} ${className}`}
      style={style}
      role="img"
      aria-label="Claudinho, o mascote do quiz"
    >
      <svg
        viewBox="0 0 100 100"
        className={`h-full w-full overflow-visible ${MOOD_ANIM[mood]}`}
      >
        {/* corpo central */}
        <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.55" />

        {/* braços do ✱ (alternando comprimento) */}
        {Array.from({ length: RAY_COUNT }).map((_, i) => {
          const long = i % 2 === 0;
          const len = long ? 40 : 26;
          const w = long ? 7 : 5;
          return (
            <rect
              key={i}
              x={50 - w / 2}
              y={50 - len}
              width={w}
              height={len * 2}
              rx={w / 2}
              fill="currentColor"
              transform={`rotate(${i * (360 / RAY_COUNT)} 50 50)`}
            />
          );
        })}

        {/* rosto */}
        {eyesClosed ? (
          <>
            <path d="M39 46 q4 3 8 0" stroke="#262220" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M53 46 q4 3 8 0" stroke="#262220" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="43" cy="47" r="4.2" fill="#262220" />
            <circle cx="59" cy="47" r="4.2" fill="#262220" />
            <circle cx="44.5" cy="45.5" r="1.3" fill="#fff" />
            <circle cx="60.5" cy="45.5" r="1.3" fill="#fff" />
          </>
        )}
      </svg>
    </div>
  );
}
