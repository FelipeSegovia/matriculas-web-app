import type { Fuente } from "@/lib/matricula";
import { api } from "./api";

export const obtenerFuentes = () => api<Fuente[]>("/fuentes");
