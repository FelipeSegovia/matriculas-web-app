import type { TextareaHTMLAttributes } from "react";
import { claseCampo } from "../estilos";

export function Textarea({ className = "", rows = 3, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} className={`${claseCampo} py-3 ${className}`} {...props} />;
}
