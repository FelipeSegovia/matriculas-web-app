import { api } from "./api";

export type Establecimiento = {
  nombre: string;
  color: string;
  anioEscolar: number;
  niveles: string[];
  jornadas: string[];
};

export const obtenerEstablecimiento = () => api<Establecimiento>("/establecimiento");
