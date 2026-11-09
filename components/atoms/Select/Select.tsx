import type { SelectHTMLAttributes } from "react";
import { claseCampo } from "../estilos";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  opciones: { valor: string; etiqueta: string }[];
  /** Texto de la opción vacía; sin él no hay opción vacía. */
  vacio?: string;
};

export function Select({ opciones, vacio, className = "", ...props }: Props) {
  return (
    <span className="relative block">
      <select className={`${claseCampo} h-12 appearance-none pr-10 ${className}`} {...props}>
        {vacio !== undefined && <option value="">{vacio}</option>}
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.etiqueta}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4.5 -translate-y-1/2 text-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}
