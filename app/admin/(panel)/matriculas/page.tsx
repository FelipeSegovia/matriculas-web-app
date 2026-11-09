"use client";

import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/molecules/EmptyState";
import { StatCard } from "@/components/molecules/StatCard";
import { FiltrosMatriculas } from "@/components/organisms/FiltrosMatriculas";
import { TablaMatriculas } from "@/components/organisms/TablaMatriculas";
import { useFuentes } from "@/hooks/useCatalogos";
import { useMatriculas } from "@/hooks/useMatriculas";
import { useFiltrosStore } from "@/stores/useFiltrosStore";

export default function MatriculasPage() {
  const filtros = useFiltrosStore((s) => s.filtros);
  const limpiar = useFiltrosStore((s) => s.limpiar);
  const { data, isPending, isError, error, refetch } = useMatriculas(filtros);
  const { data: fuentes = [] } = useFuentes();
  const items = data?.items ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl">Matrículas</h1>
          <p className="mt-2 text-lg text-ink-2">Fichas recibidas por QR y por el enlace general.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard tono="sol" valor={data?.nuevas ?? "–"} etiqueta="Nuevas sin abrir" />
          <StatCard tono="blanco" forma="br" valor={data ? items.length : "–"} etiqueta="En este listado" />
          <StatCard tono="menta" valor={data ? items.filter((m) => m.estado === "Matriculada").length : "–"} etiqueta="Matriculadas" />
        </div>
      </div>

      <section aria-label="Filtros" className="rounded-(--radius-card) bg-white p-5 shadow-(--shadow-soft) sm:p-6">
        <FiltrosMatriculas />
      </section>

      <section aria-label="Listado de matrículas" className="overflow-hidden rounded-(--radius-card) bg-white shadow-(--shadow-soft)">
        {isPending ? (
          <div className="grid place-items-center py-16">
            <Spinner etiqueta="Cargando matrículas" />
          </div>
        ) : isError ? (
          <EmptyState
            titulo="No se pudo cargar el listado"
            texto={error.message}
            accion={<Button onClick={() => refetch()}>Reintentar</Button>}
          />
        ) : items.length === 0 ? (
          <EmptyState
            titulo="No hay matrículas con estos filtros"
            texto="Pruebe con otro origen, estado o rango de fechas."
            accion={
              <Button variante="suave" onClick={limpiar}>
                Limpiar filtros
              </Button>
            }
          />
        ) : (
          <TablaMatriculas items={items} fuentes={fuentes} />
        )}
      </section>
    </div>
  );
}
