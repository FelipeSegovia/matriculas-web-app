import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Estado, Matricula } from "@/lib/matricula";
import { actualizarMatricula, cambiarEstado, cambiarOrigen } from "@/services/matriculas";
import { matriculasKey } from "./useMatriculas";
import { matriculaKey } from "./useMatricula";

// Las tres mutaciones devuelven la matrícula actualizada: se escribe en caché y se refresca el listado.
function useMutacionMatricula<V>(id: string, fn: (v: V) => Promise<Matricula>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (m) => {
      queryClient.setQueryData(matriculaKey(id), m);
      queryClient.invalidateQueries({ queryKey: [...matriculasKey, "lista"] });
    },
  });
}

export const useActualizarMatricula = (id: string) =>
  useMutacionMatricula(id, (datos: Pick<Matricula, "ficha" | "personasAutorizadas">) => actualizarMatricula(id, datos));

export const useCambiarEstado = (id: string) => useMutacionMatricula(id, (estado: Estado) => cambiarEstado(id, estado));

export const useCambiarOrigen = (id: string) =>
  useMutacionMatricula(id, ({ fuenteId, motivo }: { fuenteId: string; motivo: string }) =>
    cambiarOrigen(id, fuenteId, motivo),
  );
