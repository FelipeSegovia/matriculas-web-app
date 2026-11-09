"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wordmark } from "@/components/atoms/Wordmark";
import { Button } from "@/components/atoms/Button";
import { useEstablecimiento } from "@/hooks/useCatalogos";
import { ETIQUETAS_ROL } from "@/lib/matricula";
import { useSesionStore } from "@/stores/useSesionStore";

export function AdminHeader() {
  const router = useRouter();
  const usuario = useSesionStore((s) => s.usuario);
  const cerrar = useSesionStore((s) => s.cerrar);
  const { data: establecimiento } = useEstablecimiento();

  function salir() {
    cerrar();
    router.replace("/admin/login");
  }

  return (
    <header className="bg-school text-white [--focus:#fff]">
      <div className="wrap flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
        <Link href="/admin/matriculas" aria-label="Ir al listado de matrículas" className="no-underline">
          <Wordmark tono="color" />
        </Link>
        {establecimiento && (
          <span className="hidden border-l-2 border-white/25 pl-6 font-semibold text-white/85 md:inline">{establecimiento.nombre}</span>
        )}
        <div className="ml-auto flex items-center gap-3">
          {usuario && (
            <span className="flex flex-col items-end leading-tight">
              <span className="text-sm font-bold">{usuario.nombre}</span>
              <span className="text-xs font-semibold text-sun">{ETIQUETAS_ROL[usuario.rol]}</span>
            </span>
          )}
          <Button variante="blanco" tamano="sm" onClick={salir}>
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}
