import type { InputHTMLAttributes } from "react";
import { claseCampo } from "../estilos";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${claseCampo} h-12 ${className}`} {...props} />;
}
