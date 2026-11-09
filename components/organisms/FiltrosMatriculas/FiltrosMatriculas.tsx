"use client";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { FormField } from "@/components/molecules/FormField";
import { useEstablecimiento, useFuentes } from "@/hooks/useCatalogos";
import { ESTADOS, ETIQUETAS_ESTADO } from "@/lib/matricula";
import { FILTROS_VACIOS, useFiltrosStore } from "@/stores/useFiltrosStore";

export function FiltrosMatriculas() {
  const { filtros, cambiar, limpiar } = useFiltrosStore();
  const { data: fuentes = [] } = useFuentes();
  const { data: establecimiento } = useEstablecimiento();
  const hayFiltros = JSON.stringify(filtros) !== JSON.stringify(FILTROS_VACIOS);

  return (
    <fieldset className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-[repeat(5,minmax(0,1fr))_auto] xl:items-end">
      <legend className="sr-only">Filtrar matrículas</legend>
      <FormField etiqueta="Origen" htmlFor="f-fuente">
        <Select
          id="f-fuente"
          vacio="Todos"
          value={filtros.fuente}
          onChange={(e) => cambiar("fuente", e.target.value)}
          opciones={fuentes.map((f) => ({ valor: f.id, etiqueta: f.nombre }))}
        />
      </FormField>
      <FormField etiqueta="Estado" htmlFor="f-estado">
        <Select
          id="f-estado"
          vacio="Todos"
          value={filtros.estado}
          onChange={(e) => cambiar("estado", e.target.value)}
          opciones={ESTADOS.map((e) => ({ valor: e, etiqueta: ETIQUETAS_ESTADO[e] }))}
        />
      </FormField>
      <FormField etiqueta="Nivel" htmlFor="f-nivel">
        <Select
          id="f-nivel"
          vacio="Todos"
          value={filtros.nivel}
          onChange={(e) => cambiar("nivel", e.target.value)}
          opciones={(establecimiento?.niveles ?? []).map((n) => ({ valor: n, etiqueta: n }))}
        />
      </FormField>
      <FormField etiqueta="Desde" htmlFor="f-desde">
        <Input id="f-desde" type="date" value={filtros.desde} max={filtros.hasta || undefined} onChange={(e) => cambiar("desde", e.target.value)} />
      </FormField>
      <FormField etiqueta="Hasta" htmlFor="f-hasta">
        <Input id="f-hasta" type="date" value={filtros.hasta} min={filtros.desde || undefined} onChange={(e) => cambiar("hasta", e.target.value)} />
      </FormField>
      <Button variante="suave" onClick={limpiar} disabled={!hayFiltros} className="self-end">
        Limpiar
      </Button>
    </fieldset>
  );
}
