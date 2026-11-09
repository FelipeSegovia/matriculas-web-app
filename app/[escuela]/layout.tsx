import type { Metadata } from "next";
import { Providers } from "@/app/providers";

// El formulario se dibuja solo en el navegador (ver app/providers.tsx).
export const instant = false;

export const metadata: Metadata = { title: "Ficha de matrícula", robots: { index: false, follow: false } };

export default function EscuelaLayout({ children }: { children: React.ReactNode }) {
  return <Providers cargando="Cargando el formulario">{children}</Providers>;
}
