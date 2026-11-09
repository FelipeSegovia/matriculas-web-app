import type { ReactNode } from "react";

export const TONOS = {
  sol: "bg-sun text-ink",
  color: "bg-school text-white",
  suave: "bg-school-soft text-school-deep",
  tinta: "bg-ink text-white",
  menta: "bg-mint text-ink",
  gris: "bg-line text-ink-2",
  rojo: "bg-danger/10 text-danger",
  blanco: "bg-white text-ink ring-1 ring-line",
};

export type Tono = keyof typeof TONOS;

export function Badge({ tono = "suave", children }: { tono?: Tono; children: ReactNode }) {
  return (
    <span className={`bubble-bl inline-flex items-center whitespace-nowrap px-3 py-1 text-[0.8125rem] font-bold leading-tight ${TONOS[tono]}`}>
      {children}
    </span>
  );
}
