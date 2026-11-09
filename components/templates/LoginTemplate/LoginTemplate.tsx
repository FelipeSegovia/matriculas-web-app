import type { ReactNode } from "react";
import { Wordmark } from "@/components/atoms/Wordmark";

const SILABAS = ["ma", "tri", "cu", "la"];

/** Pantalla dividida: el color de la escuela con el mensaje, y la tarjeta del formulario. */
export function LoginTemplate({ titulo, bajada, children }: { titulo: string; bajada: string; children: ReactNode }) {
  return (
    <main className="grid min-h-full flex-1 lg:grid-cols-[1.1fr_1fr]">
      <section className="relative flex flex-col justify-between gap-10 overflow-hidden bg-school px-6 py-8 text-white sm:px-12 sm:py-12 [--focus:#fff]">
        <Wordmark tono="color" />
        <div className="relative z-10 flex max-w-lg flex-col gap-5">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl">{titulo}</h1>
          <p className="text-lg text-white/85">{bajada}</p>
        </div>
        <ul aria-hidden="true" className="flex flex-wrap gap-3">
          {SILABAS.map((s, i) => (
            <li
              key={s}
              className={`${i % 2 ? "bubble-br bg-sun text-ink" : "bubble-bl bg-white text-school-deep"} px-5 py-3 font-display text-2xl font-semibold shadow-(--shadow-float) ${i % 2 ? "translate-y-2 rotate-3" : "-rotate-2"}`}
            >
              {s}
            </li>
          ))}
        </ul>
        <span aria-hidden="true" className="absolute -right-24 -bottom-24 size-80 rounded-full bg-school-deep/50" />
        <span aria-hidden="true" className="absolute top-24 -right-10 size-32 rounded-[64px_64px_64px_16px] bg-mint/30" />
      </section>
      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md rounded-(--radius-block) bg-white p-7 shadow-(--shadow-float) sm:p-10">{children}</div>
      </section>
    </main>
  );
}
