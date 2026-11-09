import { useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerMatricula } from "@/services/matriculas";
import { matriculasKey } from "./useMatriculas";

export const matriculaKey = (id: string) => [...matriculasKey, "detalle", id] as const;

export function useMatricula(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: matriculaKey(id),
    queryFn: async () => {
      const m = await obtenerMatricula(id);
      // Abrirla la marca como vista: el contador de nuevas del listado cambia.
      queryClient.invalidateQueries({ queryKey: [...matriculasKey, "lista"] });
      return m;
    },
  });
}
