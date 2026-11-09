// Formulario público del apoderado: sin sesión del panel.
import type { PersonaAutorizada } from "@/lib/matricula";
import { api } from "./api";
import type { Establecimiento } from "./establecimiento";

export type FichaPublica = {
  ficha: Record<string, string>;
  personasAutorizadas: PersonaAutorizada[];
  consentimientoSalud: boolean;
  /** Ya la envió una vez (pasó a «Ficha completa»); puede seguir corrigiéndola. */
  enviada: boolean;
};

export const obtenerEscuela = (slug: string) => api<Establecimiento>(`/publico/escuelas/${encodeURIComponent(slug)}`);

export function crearInscripcion(
  slug: string,
  datos: { ficha: Record<string, string>; ref?: string; comoSupo?: string; aceptaPrivacidad: boolean },
) {
  return api<{ token: string }>(`/publico/escuelas/${encodeURIComponent(slug)}/inscripciones`, {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export const obtenerFichaPublica = (token: string) => api<FichaPublica>(`/publico/fichas/${encodeURIComponent(token)}`);

export function actualizarFichaPublica(token: string, datos: Omit<FichaPublica, "enviada"> & { enviar?: boolean }) {
  return api<FichaPublica>(`/publico/fichas/${encodeURIComponent(token)}`, { method: "PATCH", body: JSON.stringify(datos) });
}
