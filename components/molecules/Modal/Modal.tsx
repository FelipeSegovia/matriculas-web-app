"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = { abierto: boolean; titulo: string; onCerrar: () => void; children: ReactNode };

/** Diálogo modal nativo: Esc y el fondo lo cierran, y el foco queda atrapado adentro. */
export function Modal({ abierto, titulo, onCerrar, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-titulo"
      onClose={onCerrar}
      onClick={(e) => e.target === ref.current && onCerrar()}
      className="m-auto w-[min(100%-32px,520px)] rounded-(--radius-card) bg-white p-0 text-ink shadow-(--shadow-float) backdrop:bg-ink/45 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <h2 id="modal-titulo" className="text-2xl">
          {titulo}
        </h2>
        {children}
      </div>
    </dialog>
  );
}
