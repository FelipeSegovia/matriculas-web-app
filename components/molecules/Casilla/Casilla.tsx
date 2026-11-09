import type { InputHTMLAttributes, ReactNode } from "react";
import { Checkbox } from "@/components/atoms/Checkbox";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { children: ReactNode; error?: string };

/** Casilla con su texto al lado; toda la fila es clickeable. */
export function Casilla({ children, error, id, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-2xl bg-field px-4 py-3.5 ring-2 ring-line transition-colors has-checked:bg-school-soft has-checked:ring-school/40">
        <Checkbox id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-msg` : undefined} {...props} />
        <span className="pt-0.5 text-base font-semibold text-ink">{children}</span>
      </label>
      {error && (
        <p id={`${id}-msg`} className="text-sm font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
