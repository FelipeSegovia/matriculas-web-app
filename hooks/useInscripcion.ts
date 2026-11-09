import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  actualizarFichaPublica,
  crearInscripcion,
  obtenerEscuela,
  obtenerFichaPublica,
  type FichaPublica,
} from "@/services/inscripcion";

export const useEscuela = (slug: string) =>
  useQuery({ queryKey: ["escuela", slug], queryFn: () => obtenerEscuela(slug), staleTime: Infinity, retry: false });

export function useCrearInscripcion(slug: string) {
  return useMutation({ mutationFn: (datos: Parameters<typeof crearInscripcion>[1]) => crearInscripcion(slug, datos) });
}

const fichaKey = (token: string) => ["ficha-publica", token] as const;

export const useFichaPublica = (token: string) =>
  useQuery({ queryKey: fichaKey(token), queryFn: () => obtenerFichaPublica(token), retry: false, staleTime: Infinity });

export function useActualizarFichaPublica(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Omit<FichaPublica, "enviada"> & { enviar?: boolean }) => actualizarFichaPublica(token, datos),
    onSuccess: (f) => queryClient.setQueryData(fichaKey(token), f),
  });
}
