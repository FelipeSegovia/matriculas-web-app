import { api } from "./api";

export type Establecimiento = {
  slug: string;
  nombre: string;
  direccion: string;
  color: string;
  anioEscolar: number;
  niveles: string[];
  jornadas: string[];
};

export const obtenerEstablecimiento = () => api<Establecimiento>("/establecimiento");
