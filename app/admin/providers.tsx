"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Spinner } from "@/components/atoms/Spinner";
import { useEstablecimiento } from "@/hooks/useCatalogos";
import { useSesionStore } from "@/stores/useSesionStore";

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

/** Aplica el color del establecimiento a todo el panel (--c). */
function ColorEscuela() {
  const { data } = useEstablecimiento();
  useEffect(() => {
    if (data?.color) document.documentElement.style.setProperty("--c", data.color);
  }, [data?.color]);
  return null;
}

/** Sin sesión, todo /admin lleva al login; con sesión, el login lleva al listado. */
function GuardSesion({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useSesionStore((s) => s.token);
  const enLogin = pathname === "/admin/login";
  const redirigir = enLogin ? !!token : !token;

  useEffect(() => {
    if (redirigir) router.replace(enLogin ? "/admin/matriculas" : "/admin/login");
  }, [redirigir, enLogin, router]);

  return redirigir ? null : children;
}

// El panel se dibuja solo en el navegador: la sesión vive en sessionStorage y la API es MSW.
export function Providers({ children }: { children: ReactNode }) {
  const [listo, setListo] = useState(false);

  useEffect(() => {
    iniciarMocks().finally(() => setListo(true));
  }, []);

  if (!listo)
    return (
      <div className="grid flex-1 place-items-center">
        <Spinner etiqueta="Cargando el panel" />
      </div>
    );

  return (
    <QueryClientProvider client={getQueryClient()}>
      <ColorEscuela />
      <GuardSesion>{children}</GuardSesion>
    </QueryClientProvider>
  );
}
