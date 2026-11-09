// Color de cada estado en el panel. Vive fuera de los componentes para que tabla y ficha usen el mismo.
import type { Estado } from "./matricula.ts";

export const TONO_ESTADO = {
  PreInscrita: "sol",
  FichaCompleta: "blanco",
  EvaluacionAgendada: "suave",
  Evaluada: "color",
  ListaParaFirmar: "menta",
  Matriculada: "tinta",
  EnListaDeEspera: "gris",
  Descartada: "rojo",
} as const satisfies Record<Estado, string>;

export function formatearFecha(iso: string, conHora = false) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    ...(conHora ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}
