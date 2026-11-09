import { useQuery } from "@tanstack/react-query";
import { listarMatriculas } from "@/services/matriculas";
import type { Filtros } from "@/stores/useFiltrosStore";

export const matriculasKey = ["matriculas"] as const;

export function useMatriculas(filtros: Filtros) {
  return useQuery({ queryKey: [...matriculasKey, "lista", filtros], queryFn: () => listarMatriculas(filtros) });
}
