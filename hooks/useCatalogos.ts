import { useQuery } from "@tanstack/react-query";
import { obtenerEstablecimiento } from "@/services/establecimiento";
import { obtenerFuentes } from "@/services/fuentes";

// Cambian poco: se piden una vez por sesión.
export const useEstablecimiento = () =>
  useQuery({ queryKey: ["establecimiento"], queryFn: obtenerEstablecimiento, staleTime: Infinity });

export const useFuentes = () => useQuery({ queryKey: ["fuentes"], queryFn: obtenerFuentes, staleTime: Infinity });
