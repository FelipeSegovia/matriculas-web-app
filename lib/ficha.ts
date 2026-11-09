// Ficha de matrícula modernizada en 9 secciones (D09 + D10). El formulario del panel se arma desde estos datos.
// Las opciones salen de la ficha en papel; RSH, Seguridades y Oportunidades reemplazan a CAS/FPS/Chile Solidario.

export type TipoCampo = "texto" | "area" | "fecha" | "rut" | "telefono" | "correo" | "numero" | "seleccion";

export type Campo = {
  clave: string;
  etiqueta: string;
  tipo: TipoCampo;
  /** Lista fija, o los niveles/jornadas que configura cada establecimiento. */
  opciones?: string[] | "niveles" | "jornadas";
  obligatorio?: boolean;
  /** Dato de contacto: Secretaría puede editarlo (D05). */
  contacto?: boolean;
  ancho?: "completo";
};

export type Seccion = { id: string; titulo: string; campos: Campo[] };

const SI_NO = ["Sí", "No"];
const PRIORIDAD = ["Alta", "Baja"];

const padreOMadre = (p: "madre" | "padre"): Campo[] => [
  { clave: `${p}.nombre`, etiqueta: "Nombre completo", tipo: "texto", ancho: "completo" },
  { clave: `${p}.rut`, etiqueta: "RUT", tipo: "rut" },
  { clave: `${p}.edad`, etiqueta: "Edad", tipo: "numero" },
  { clave: `${p}.escolaridad`, etiqueta: "Escolaridad", tipo: "texto" },
  { clave: `${p}.ocupacion`, etiqueta: "Ocupación", tipo: "texto" },
  { clave: `${p}.telefono`, etiqueta: "Teléfono", tipo: "telefono", contacto: true },
];

export const SECCIONES: Seccion[] = [
  {
    id: "basicos",
    titulo: "1. Datos básicos",
    campos: [
      { clave: "alumno.nombre", etiqueta: "Nombre completo del alumno", tipo: "texto", obligatorio: true, ancho: "completo" },
      { clave: "alumno.rut", etiqueta: "RUT del alumno", tipo: "rut", obligatorio: true },
      { clave: "alumno.fechaNacimiento", etiqueta: "Fecha de nacimiento", tipo: "fecha", obligatorio: true },
      { clave: "alumno.nivel", etiqueta: "Nivel al que postula", tipo: "seleccion", opciones: "niveles", obligatorio: true },
      { clave: "alumno.jornada", etiqueta: "Jornada preferida", tipo: "seleccion", opciones: "jornadas", obligatorio: true },
      { clave: "apoderado.nombre", etiqueta: "Nombre del apoderado", tipo: "texto", obligatorio: true, ancho: "completo" },
      { clave: "apoderado.parentesco", etiqueta: "Parentesco", tipo: "texto", obligatorio: true },
      { clave: "apoderado.rut", etiqueta: "RUT del apoderado", tipo: "rut", obligatorio: true },
      { clave: "apoderado.telefono", etiqueta: "Teléfono", tipo: "telefono", obligatorio: true, contacto: true },
      { clave: "apoderado.correo", etiqueta: "Correo (opcional)", tipo: "correo", contacto: true },
    ],
  },
  {
    id: "alumno",
    titulo: "2. Alumno",
    campos: [
      { clave: "alumno.nacionalidad", etiqueta: "Nacionalidad", tipo: "texto" },
      { clave: "alumno.comuna", etiqueta: "Comuna", tipo: "texto" },
      { clave: "alumno.domicilio", etiqueta: "Domicilio", tipo: "texto", ancho: "completo" },
      { clave: "alumno.procedencia", etiqueta: "Procedencia", tipo: "texto", ancho: "completo" },
      { clave: "alumno.diagnostico", etiqueta: "Diagnóstico", tipo: "area", ancho: "completo" },
    ],
  },
  {
    id: "medicos",
    titulo: "3. Antecedentes médicos",
    campos: [
      { clave: "medico.prevision", etiqueta: "Tipo de previsión", tipo: "texto" },
      { clave: "medico.lugarAtencion", etiqueta: "Lugar de atención", tipo: "texto" },
      { clave: "medico.grupoSanguineo", etiqueta: "Grupo sanguíneo", tipo: "texto" },
      { clave: "medico.alergias", etiqueta: "Alergias", tipo: "area", ancho: "completo" },
      { clave: "medico.indicaciones", etiqueta: "Indicaciones médicas", tipo: "area", ancho: "completo" },
    ],
  },
  { id: "madre", titulo: "4. Madre", campos: padreOMadre("madre") },
  { id: "padre", titulo: "5. Padre", campos: padreOMadre("padre") },
  {
    id: "apoderado",
    titulo: "6. Apoderado",
    campos: [
      { clave: "apoderado.fechaNacimiento", etiqueta: "Fecha de nacimiento", tipo: "fecha" },
      { clave: "apoderado.nacionalidad", etiqueta: "Nacionalidad", tipo: "texto" },
      { clave: "apoderado.domicilio", etiqueta: "Domicilio", tipo: "texto", ancho: "completo" },
      { clave: "apoderado.escolaridad", etiqueta: "Escolaridad", tipo: "texto" },
      { clave: "apoderado.ocupacion", etiqueta: "Ocupación laboral", tipo: "texto" },
    ],
  },
  {
    id: "familia",
    titulo: "7. Antecedentes familiares",
    campos: [
      {
        clave: "familia.jefeHogar",
        etiqueta: "Jefe o jefa de hogar",
        tipo: "seleccion",
        opciones: ["Padre", "Madre", "Ambos", "Abuelos maternos", "Abuelos paternos", "Otros"],
      },
      {
        clave: "familia.ingreso",
        etiqueta: "Ingreso mensual familiar",
        tipo: "seleccion",
        opciones: [
          "Menos de $100.000",
          "Entre $100.000 y $200.000",
          "Entre $200.001 y $300.000",
          "Entre $300.001 y $400.000",
          "Entre $400.001 y $600.000",
          "Más de $600.000",
        ],
      },
      { clave: "familia.rshInscrito", etiqueta: "Inscrito en el Registro Social de Hogares", tipo: "seleccion", opciones: SI_NO },
      {
        clave: "familia.rshTramo",
        etiqueta: "Tramo RSH",
        tipo: "seleccion",
        opciones: ["40%", "50%", "60%", "70%", "80%", "90%", "100%", "No tiene"],
      },
      { clave: "familia.seguridadesOportunidades", etiqueta: "Seguridades y Oportunidades", tipo: "seleccion", opciones: SI_NO },
      { clave: "familia.fosis", etiqueta: "FOSIS", tipo: "seleccion", opciones: SI_NO },
      { clave: "familia.suf", etiqueta: "Subsidio Único Familiar (SUF)", tipo: "seleccion", opciones: SI_NO },
      { clave: "familia.vivienda", etiqueta: "Vivienda", tipo: "seleccion", opciones: ["Propia", "Arrendada", "Allegado"] },
      { clave: "familia.tipoVivienda", etiqueta: "Tipo de vivienda", tipo: "texto" },
      { clave: "familia.aguaPotable", etiqueta: "Agua potable", tipo: "seleccion", opciones: SI_NO },
      { clave: "familia.luzElectrica", etiqueta: "Luz eléctrica", tipo: "seleccion", opciones: SI_NO },
      { clave: "familia.dormitorios", etiqueta: "N° de dormitorios", tipo: "numero" },
      { clave: "familia.habitantes", etiqueta: "N° de habitantes", tipo: "numero" },
      { clave: "familia.internet", etiqueta: "Internet", tipo: "seleccion", opciones: SI_NO },
      { clave: "familia.computador", etiqueta: "Computador", tipo: "seleccion", opciones: SI_NO },
      { clave: "familia.celular", etiqueta: "Celular", tipo: "seleccion", opciones: SI_NO },
      { clave: "familia.espacioEstudio", etiqueta: "Espacio o lugar de estudio", tipo: "seleccion", opciones: SI_NO },
    ],
  },
  // La sección 8 (personas autorizadas a retirar) es una lista de filas; el formulario la dibuja aparte.
  {
    id: "requerimientos",
    titulo: "9. Requerimientos",
    campos: [
      { clave: "req.junaeb", etiqueta: "Alimentación JUNAEB", tipo: "seleccion", opciones: SI_NO },
      { clave: "req.junaebPrioridad", etiqueta: "Prioridad JUNAEB", tipo: "seleccion", opciones: PRIORIDAD },
      { clave: "req.furgon", etiqueta: "Furgón escolar", tipo: "seleccion", opciones: SI_NO },
      { clave: "req.furgonPrioridad", etiqueta: "Prioridad furgón", tipo: "seleccion", opciones: PRIORIDAD },
      { clave: "req.extension", etiqueta: "Extensión horaria", tipo: "seleccion", opciones: SI_NO },
      { clave: "req.extensionPrioridad", etiqueta: "Prioridad extensión", tipo: "seleccion", opciones: PRIORIDAD },
      { clave: "req.observaciones", etiqueta: "Observaciones", tipo: "area", ancho: "completo" },
    ],
  },
];

export const CAMPOS = SECCIONES.flatMap((s) => s.campos);

export const CLAVES_CONTACTO = CAMPOS.filter((c) => c.contacto).map((c) => c.clave);
