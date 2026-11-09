import type { ButtonHTMLAttributes } from "react";

const VARIANTES = {
  color: "bg-school text-white hover:bg-school-deep",
  tinta: "bg-ink text-white hover:bg-ink-2",
  blanco: "bg-white text-school-deep ring-2 ring-line hover:ring-school/40",
  suave: "bg-school-soft text-school-deep hover:bg-school/15",
  peligro: "bg-white text-danger ring-2 ring-danger/30 hover:bg-danger hover:text-white",
};

const TAMANOS = {
  md: "min-h-12 px-6 text-base",
  sm: "min-h-10 px-4 text-sm",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: keyof typeof VARIANTES;
  tamano?: keyof typeof TAMANOS;
};

export function Button({ variante = "color", tamano = "md", className = "", type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      className={
        "inline-flex items-center justify-center gap-2 rounded-[20px] font-display font-semibold leading-none " +
        "transition-[transform,box-shadow,background-color,color] duration-200 ease-(--ease-out-expo) " +
        "hover:-translate-y-0.5 hover:shadow-(--shadow-soft) active:translate-y-0 active:scale-[0.98] " +
        "disabled:pointer-events-none disabled:opacity-50 " +
        `${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`
      }
      {...props}
    />
  );
}
