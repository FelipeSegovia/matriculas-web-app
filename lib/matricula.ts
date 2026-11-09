// Tipos y reglas del ciclo de vida de una matrícula (D03, D04, D06 en las notas de Obsidian).

export type Estado =
  | "PreInscrita"
  | "FichaCompleta"
  | "EvaluacionAgendada"
  | "Evaluada"
  | "ListaParaFirmar"
  | "Matriculada"
  | "EnListaDeEspera"
  | "Descartada";

export const ESTADOS: Estado[] = [
  "PreInscrita",
  "FichaCompleta",
  "EvaluacionAgendada",
  "Evaluada",
  "ListaParaFirmar",
  "Matriculada",
  "EnListaDeEspera",
  "Descartada",
];

export const ETIQUETAS_ESTADO: Record<Estado, string> = {
  PreInscrita: "Pre-inscrita",
  FichaCompleta: "Ficha completa",
  EvaluacionAgendada: "Evaluación agendada",
  Evaluada: "Evaluada",
  ListaParaFirmar: "Lista para firmar",
  Matriculada: "Matriculada",
  EnListaDeEspera: "En lista de espera",
  Descartada: "Descartada",
};

export const TRANSICIONES: Record<Estado, Estado[]> = {
  PreInscrita: ["FichaCompleta", "Descartada"],
  FichaCompleta: ["EvaluacionAgendada"],
  EvaluacionAgendada: ["Evaluada"],
  Evaluada: ["ListaParaFirmar", "EnListaDeEspera", "Descartada"],
  EnListaDeEspera: ["ListaParaFirmar"],
  ListaParaFirmar: ["Matriculada"],
  Matriculada: [],
  Descartada: [],
};

export function puedeTransicionar(desde: Estado, hacia: Estado) {
  return TRANSICIONES[desde].includes(hacia);
}

export type Rol = "Direccion" | "UTP" | "Secretaria";

export const ETIQUETAS_ROL: Record<Rol, string> = {
  Direccion: "Dirección",
  UTP: "UTP",
  Secretaria: "Secretaría",
};

export type Usuario = { id: string; nombre: string; correo: string; rol: Rol };

export type TipoFuente = "Promotora" | "Educadora" | "Campana" | "Organico";

export type Fuente = { id: string; codigo: string; nombre: string; tipo: TipoFuente };

export type CambioOrigen = {
  fecha: string;
  usuario: string;
  anterior: string;
  nuevo: string;
  motivo: string;
};

export type PersonaAutorizada = { parentesco: string; nombre: string; edad: string; telefono: string };

/** Campos de la ficha por clave (ver lib/ficha.ts). Todo es texto, como en el formulario. */
export type Ficha = Record<string, string>;

export type Matricula = {
  id: string;
  estado: Estado;
  fuenteId: string;
  creadaEn: string;
  numero: string | null;
  vista: boolean;
  tokenActivo: boolean;
  ficha: Ficha;
  personasAutorizadas: PersonaAutorizada[];
  historialOrigen: CambioOrigen[];
};

/** Fila del listado: lo justo para la tabla. */
export type MatriculaResumen = Pick<Matricula, "id" | "estado" | "fuenteId" | "creadaEn" | "numero" | "vista"> & {
  alumno: string;
  rut: string;
  nivel: string;
  jornada: string;
};

export function resumir(m: Matricula): MatriculaResumen {
  return {
    id: m.id,
    estado: m.estado,
    fuenteId: m.fuenteId,
    creadaEn: m.creadaEn,
    numero: m.numero,
    vista: m.vista,
    alumno: m.ficha["alumno.nombre"] ?? "",
    rut: m.ficha["alumno.rut"] ?? "",
    nivel: m.ficha["alumno.nivel"] ?? "",
    jornada: m.ficha["alumno.jornada"] ?? "",
  };
}

function edadEn(nacimiento: string, fecha: Date) {
  const n = new Date(`${nacimiento}T00:00:00`);
  if (Number.isNaN(n.getTime())) return null;
  let edad = fecha.getFullYear() - n.getFullYear();
  const mes = fecha.getMonth() - n.getMonth();
  if (mes < 0 || (mes === 0 && fecha.getDate() < n.getDate())) edad--;
  return edad;
}

/** Edad en años cumplidos a la fecha dada (por defecto, hoy). */
export function edadActual(nacimiento: string, hoy = new Date()) {
  return edadEn(nacimiento, hoy);
}

/** Edad al 31 de marzo del año escolar al que postula (D09). */
export function edadAMarzo(nacimiento: string, anioEscolar: number) {
  return edadEn(nacimiento, new Date(anioEscolar, 2, 31));
}
