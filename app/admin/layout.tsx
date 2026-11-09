import type { Metadata } from "next";
import { MARCA } from "@/lib/marca";
import { Providers } from "./providers";

// El panel se dibuja solo en el navegador (ver providers.tsx): no hay UI de servidor que validar.
// Cada segmento que el servidor no dibuja repite este opt-out.
export const instant = false;

export const metadata: Metadata = {
  title: { default: `Panel · ${MARCA}`, template: `%s · ${MARCA}` },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
