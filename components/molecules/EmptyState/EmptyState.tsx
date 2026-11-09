import type { ReactNode } from "react";

export function EmptyState({ titulo, texto, accion }: { titulo: string; texto: string; accion?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span aria-hidden="true" className="bubble-bl grid size-14 place-items-center bg-school-soft font-display text-2xl text-school">
        ?
      </span>
      <h3 className="text-xl">{titulo}</h3>
      <p className="max-w-sm text-muted">{texto}</p>
      {accion}
    </div>
  );
}
