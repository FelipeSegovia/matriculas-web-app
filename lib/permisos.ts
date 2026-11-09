// Permisos por rol dentro del establecimiento (D05). La UI los usa para mostrar u ocultar acciones;
// el backend real debe volver a validarlos.
import { TRANSICIONES, type Estado, type Rol } from "./matricula.ts";

export type Accion = "editarFicha" | "editarContacto" | "cambiarOrigen";

const ACCIONES: Record<Rol, Accion[]> = {
  Direccion: ["editarFicha", "editarContacto", "cambiarOrigen"],
  UTP: ["editarFicha", "editarContacto"],
  Secretaria: ["editarContacto"],
};

export function puede(rol: Rol, accion: Accion) {
  return ACCIONES[rol].includes(accion);
}

/** Estados a los que el rol puede mover una matrícula. Secretaría solo marca la firma. */
export function transicionesPermitidas(rol: Rol, estado: Estado): Estado[] {
  const siguientes = TRANSICIONES[estado];
  return rol === "Secretaria" ? siguientes.filter((e) => e === "Matriculada") : siguientes;
}
