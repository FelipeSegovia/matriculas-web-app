"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Providers } from "@/app/providers";
import { useEstablecimiento } from "@/hooks/useCatalogos";
import { useSesionStore } from "@/stores/useSesionStore";

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

// La sesión del panel vive en sessionStorage (ver useSesionStore).
export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <Providers cargando="Cargando el panel">
      <ColorEscuela />
      <GuardSesion>{children}</GuardSesion>
    </Providers>
  );
}
