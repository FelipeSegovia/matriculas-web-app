import type { Estado, Matricula, MatriculaResumen } from "@/lib/matricula";
import type { Filtros } from "@/stores/useFiltrosStore";
import { api } from "./api";

export function listarMatriculas(filtros: Filtros) {
  const q = new URLSearchParams(Object.entries(filtros).filter(([, v]) => v));
  return api<{ items: MatriculaResumen[]; nuevas: number }>(`/matriculas?${q}`);
}

export const obtenerMatricula = (id: string) => api<Matricula>(`/matriculas/${id}`);

export function actualizarMatricula(id: string, datos: Pick<Matricula, "ficha" | "personasAutorizadas">) {
  return api<Matricula>(`/matriculas/${id}`, { method: "PATCH", body: JSON.stringify(datos) });
}

export function cambiarEstado(id: string, estado: Estado) {
  return api<Matricula>(`/matriculas/${id}/estado`, { method: "POST", body: JSON.stringify({ estado }) });
}

export function cambiarOrigen(id: string, fuenteId: string, motivo: string) {
  return api<Matricula>(`/matriculas/${id}/origen`, { method: "POST", body: JSON.stringify({ fuenteId, motivo }) });
}
