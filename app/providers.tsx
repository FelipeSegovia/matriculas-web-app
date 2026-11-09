"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Spinner } from "@/components/atoms/Spinner";

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") return new QueryClient();
  browserQueryClient ??= new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } });
  return browserQueryClient;
}

// En desarrollo, MSW responde la API. Única importación permitida desde mocks/.
// Una sola promesa: StrictMode ejecuta el efecto dos veces y MSW no admite dos start().
let arranqueMocks: Promise<unknown> | undefined;

function iniciarMocks() {
  if (process.env.NODE_ENV !== "development") return Promise.resolve();
  arranqueMocks ??= import("@/mocks/browser").then(({ worker }) => worker.start({ onUnhandledFrame: "bypass", quiet: true }));
  return arranqueMocks;
}

/**
 * TanStack Query + MSW. Los hijos se dibujan solo en el navegador, cuando MSW ya responde,
 * así que cada segmento que lo use declara `export const instant = false`.
 */
export function Providers({ cargando, children }: { cargando: string; children: ReactNode }) {
  const [listo, setListo] = useState(false);

  useEffect(() => {
    iniciarMocks().finally(() => setListo(true));
  }, []);

  if (!listo)
    return (
      <div className="grid flex-1 place-items-center">
        <Spinner etiqueta={cargando} />
      </div>
    );

  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}
