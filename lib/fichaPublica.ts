// Cómo se presenta la ficha (lib/ficha.ts) al apoderado: un paso por pantalla, con su propio lenguaje.
import { SECCIONES, type Campo } from "./ficha.ts";

export type Paso = { id: string; titulo: string; bajada: string; campos: Campo[] };

/** Etiquetas y ayudas para el apoderado; lo que no está aquí usa la etiqueta del panel. */
const TEXTOS: Record<string, { etiqueta?: string; ayuda?: string; placeholder?: string }> = {
  "alumno.nombre": { etiqueta: "Nombre completo del alumno(a)", placeholder: "Nombres y apellidos" },
  "alumno.rut": { etiqueta: "RUT del alumno(a)", ayuda: "Aparece en su certificado de nacimiento o carnet.", placeholder: "12.345.678-5" },
  "alumno.nivel": { etiqueta: "Nivel al que postula", ayuda: "La escuela lo confirma según la edad al 31 de marzo." },
  "alumno.jornada": { etiqueta: "Jornada que prefiere" },
  "apoderado.nombre": { etiqueta: "Su nombre", placeholder: "Nombres y apellidos" },
  "apoderado.parentesco": { etiqueta: "¿Qué es usted del alumno(a)?", placeholder: "Ej.: madre, padre, abuela" },
  "apoderado.rut": { etiqueta: "Su RUT", placeholder: "12.345.678-5" },
  "apoderado.telefono": { etiqueta: "Su celular", ayuda: "Por aquí le contacta la escuela.", placeholder: "+56 9 1234 5678" },
  "apoderado.correo": { etiqueta: "Su correo (opcional)", placeholder: "nombre@correo.cl" },
  "alumno.procedencia": { etiqueta: "¿Dónde estaba antes el alumno(a)?", placeholder: "Ej.: en casa, jardín infantil" },
  "alumno.diagnostico": { etiqueta: "Diagnóstico (si tiene uno)", ayuda: "Por ejemplo, el de una evaluación fonoaudiológica anterior." },
  "medico.prevision": { placeholder: "Ej.: Fonasa, Isapre" },
  "medico.lugarAtencion": { etiqueta: "¿Dónde se atiende?", placeholder: "Ej.: CESFAM, consultorio o clínica" },
  "medico.grupoSanguineo": { placeholder: "Ej.: O+ (o déjelo en blanco)" },
  "medico.alergias": { placeholder: "Ej.: penicilina, maní" },
  "medico.indicaciones": { placeholder: "Medicamentos, cuidados u otra indicación del médico" },
  "madre.escolaridad": { etiqueta: "Hasta qué curso estudió" },
  "padre.escolaridad": { etiqueta: "Hasta qué curso estudió" },
  "apoderado.escolaridad": { etiqueta: "Hasta qué curso estudió" },
  "familia.jefeHogar": { etiqueta: "¿Quién aporta los ingresos del hogar?" },
  "familia.rshTramo": { etiqueta: "Tramo del Registro Social de Hogares", ayuda: "Lo encuentra en registrosocial.gob.cl" },
  "familia.vivienda": { etiqueta: "La vivienda es" },
  "familia.tipoVivienda": { placeholder: "Ej.: casa, departamento" },
  "familia.habitantes": { etiqueta: "Personas que viven ahí" },
};

export function textoDe(c: Campo) {
  return { etiqueta: TEXTOS[c.clave]?.etiqueta ?? c.etiqueta, ayuda: TEXTOS[c.clave]?.ayuda, placeholder: TEXTOS[c.clave]?.placeholder };
}

const BAJADAS: Record<string, { titulo: string; bajada: string }> = {
  basicos: { titulo: "Datos básicos", bajada: "Con este paso su inscripción ya queda guardada." },
  alumno: { titulo: "Alumno(a)", bajada: "Domicilio y de dónde viene." },
  medicos: { titulo: "Salud", bajada: "Solo lo usa la escuela para cuidar al alumno(a)." },
  madre: { titulo: "Datos de la madre", bajada: "Si no aplica o prefiere no informar, siga al paso siguiente." },
  padre: { titulo: "Datos del padre", bajada: "Si no aplica o prefiere no informar, siga al paso siguiente." },
  apoderado: { titulo: "Apoderado", bajada: "Es quien firma la matrícula y a quien llama la escuela." },
  familia: { titulo: "Hogar y vivienda", bajada: "Ayuda a la escuela a postular al alumno(a) a beneficios." },
  autorizadas: { titulo: "Retiro del alumno(a)", bajada: "Personas que, además del apoderado, pueden retirarlo." },
  requerimientos: { titulo: "Servicios", bajada: "Marque lo que necesita. La escuela le confirma si hay cupo." },
};

/** Los 9 pasos de D09, en orden. El paso 8 (personas autorizadas) no tiene campos: es una lista de filas. */
export const PASOS: Paso[] = [
  ...SECCIONES.slice(0, 7),
  { id: "autorizadas", titulo: "", campos: [] },
  SECCIONES[7],
].map((s) => ({ id: s.id, ...BAJADAS[s.id], campos: s.campos.filter((c) => !c.soloEscuela) }));

export const PASO_SALUD = PASOS.findIndex((p) => p.id === "medicos");

export const CLAVES_SALUD = PASOS[PASO_SALUD].campos.map((c) => c.clave);

/** Sin código QR se pregunta cómo llegó (D04); la respuesta no genera comisión. */
export const COMO_SUPO = [
  "Una promotora",
  "Una educadora de la escuela",
  "Un flyer o afiche",
  "Redes sociales",
  "Un familiar o conocido",
  "Otro",
];

/** Número para wa.me: solo dígitos y con 56 delante. Si no parece celular chileno, null. */
export function numeroWhatsapp(telefono: string) {
  const d = telefono.replace(/\D/g, "");
  if (/^569\d{8}$/.test(d)) return d;
  if (/^9\d{8}$/.test(d)) return `56${d}`;
  return null;
}

/** Opciones de un campo: lista fija, o los niveles/jornadas de la escuela. */
export function opcionesDe(c: Campo, escuela: { niveles: string[]; jornadas: string[] }) {
  return c.opciones === "niveles" ? escuela.niveles : c.opciones === "jornadas" ? escuela.jornadas : (c.opciones ?? []);
}
