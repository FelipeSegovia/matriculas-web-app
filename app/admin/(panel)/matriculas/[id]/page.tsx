"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/molecules/EmptyState";
import { FichaMatriculaForm } from "@/components/organisms/FichaMatriculaForm";
import { PanelEstado } from "@/components/organisms/PanelEstado";
import { PanelOrigen } from "@/components/organisms/PanelOrigen";
import { useEstablecimiento, useFuentes } from "@/hooks/useCatalogos";
import { useMatricula } from "@/hooks/useMatricula";
import { TONO_ESTADO, formatearFecha } from "@/lib/estadoUi";
import { ETIQUETAS_ESTADO } from "@/lib/matricula";
import { useSesionStore } from "@/stores/useSesionStore";

function Cargando() {
  return (
    <div className="grid place-items-center py-24">
      <Spinner etiqueta="Cargando la ficha" />
    </div>
  );
}

function DetalleMatricula() {
  const { id } = useParams<{ id: string }>();
  const rol = useSesionStore((s) => s.usuario?.rol);
  const matricula = useMatricula(id);
  const { data: establecimiento } = useEstablecimiento();
  const { data: fuentes = [] } = useFuentes();

  if (matricula.isError)
    return (
      <EmptyState
        titulo="No encontramos esta ficha"
        texto={matricula.error.message}
        accion={
          <Link href="/admin/matriculas" className="font-bold text-school-deep">
            Volver al listado
          </Link>
        }
      />
    );
  if (!matricula.data || !establecimiento || !rol) return <Cargando />;

  const m = matricula.data;
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Link href="/admin/matriculas" className="w-fit text-sm font-bold text-school-deep">
          ← Volver al listado
        </Link>
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <div className="mr-auto">
            <h1 className="text-3xl sm:text-4xl">{m.ficha["alumno.nombre"]}</h1>
            <p className="mt-2 text-ink-2">
              RUT {m.ficha["alumno.rut"]} · Recibida el {formatearFecha(m.creadaEn, true)}
            </p>
          </div>
          <Badge tono={TONO_ESTADO[m.estado]}>{ETIQUETAS_ESTADO[m.estado]}</Badge>
          <div className="bubble-br bg-white px-4 py-2 shadow-(--shadow-soft)">
            <span className="block text-xs font-bold text-muted">N° de matrícula</span>
            <span className="font-display text-xl font-semibold">{m.numero ?? "Sin asignar"}</span>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="order-2 lg:order-1">
          <FichaMatriculaForm key={m.id} matricula={m} establecimiento={establecimiento} rol={rol} />
        </div>
        <aside className="order-1 flex flex-col gap-6 lg:sticky lg:top-6 lg:order-2">
          <PanelEstado matricula={m} rol={rol} />
          <PanelOrigen matricula={m} fuentes={fuentes} rol={rol} />
          <p className="px-2 text-sm text-muted">
            Enlace para retomar del apoderado: <span className="font-bold text-ink-2">{m.tokenActivo ? "activo" : "desactivado"}</span>
          </p>
        </aside>
      </div>
    </div>
  );
}

export default function MatriculaPage() {
  return (
    <Suspense fallback={<Cargando />}>
      <DetalleMatricula />
    </Suspense>
  );
}
