import type { ReactNode } from "react";
import { Label } from "@/components/atoms/Label";

type Props = {
  etiqueta: string;
  htmlFor: string;
  error?: string;
  ayuda?: string;
  obligatorio?: boolean;
  className?: string;
  children: ReactNode;
};

/** Etiqueta + control + mensaje. El control debe usar `aria-describedby={`${htmlFor}-msg`}` si hay mensaje. */
export function FormField({ etiqueta, htmlFor, error, ayuda, obligatorio, className = "", children }: Props) {
  const mensaje = error ?? ayuda;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <Label htmlFor={htmlFor}>
        {etiqueta}
        {obligatorio && (
          <span className="text-school" aria-hidden="true">
            {" "}*
          </span>
        )}
      </Label>
      {children}
      {mensaje && (
        <p id={`${htmlFor}-msg`} className={`text-sm ${error ? "font-semibold text-danger" : "text-muted"}`}>
          {mensaje}
        </p>
      )}
    </div>
  );
}
