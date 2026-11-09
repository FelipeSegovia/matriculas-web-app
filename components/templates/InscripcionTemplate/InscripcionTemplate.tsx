import type { CSSProperties, ReactNode } from "react";
import { MARCA } from "@/lib/marca";

type Props = { escuela?: { nombre: string; direccion: string; color: string }; children: ReactNode };

/** Formulario del apoderado: encabezado con el color y nombre de la escuela, y una columna angosta pensada para celular. */
export function InscripcionTemplate({ escuela, children }: Props) {
  return (
    <div className="color-escuela flex min-h-full flex-1 flex-col" style={escuela ? ({ "--c": escuela.color } as CSSProperties) : undefined}>
      <header className="bg-school text-white [--focus:#fff]">
        <div className="mx-auto flex w-full max-w-[680px] items-center gap-3 px-4 py-5">
          <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-[22px_22px_22px_6px] bg-white text-school">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H11v18H5.5A2.5 2.5 0 0 1 3 18.5z" />
              <path d="M21 5.5A2.5 2.5 0 0 0 18.5 3H13v18h5.5a2.5 2.5 0 0 0 2.5-2.5z" />
            </svg>
          </span>
          <span className="leading-tight">
            <b className="block font-display text-lg font-semibold">{escuela?.nombre ?? "Inscripción"}</b>
            {escuela && <span className="text-sm text-white/80">{escuela.direccion}</span>}
          </span>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col gap-6 px-4 py-7 sm:py-10">{children}</main>
      <footer className="pb-8 text-center text-xs font-semibold text-muted">Formulario de {MARCA}</footer>
    </div>
  );
}
