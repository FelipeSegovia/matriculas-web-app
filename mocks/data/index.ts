// Datos ficticios para desarrollo. Ningún nombre, RUT ni colegio es real.
import type { Estado, Fuente, Matricula, Usuario } from "@/lib/matricula";
import { digitoVerificador, formatearRut } from "@/lib/rut";

export const establecimiento = {
  slug: "ejemplo",
  nombre: "Escuela de Lenguaje Ejemplo",
  direccion: "Av. Ejemplo 123, Comuna Ejemplo",
  color: "#5b3fd6",
  anioEscolar: 2027,
  niveles: ["Medio Mayor", "Prekínder", "Kínder"],
  jornadas: ["Mañana", "Tarde"],
};

export type Establecimiento = typeof establecimiento;

export const fuentes: Fuente[] = [
  { id: "f1", codigo: "PROM-CR", nombre: "Carolina Rojas", tipo: "Promotora" },
  { id: "f2", codigo: "PROM-DM", nombre: "Daniela Muñoz", tipo: "Promotora" },
  { id: "f3", codigo: "EDU-PH", nombre: "Paula Herrera", tipo: "Educadora" },
  { id: "f4", codigo: "FLY-V27", nombre: "Flyer verano 2027", tipo: "Campana" },
  { id: "f5", codigo: "ORG", nombre: "Orgánico / Declarado", tipo: "Organico" },
];

/** Contraseña de todos los usuarios de ejemplo. */
export const CLAVE_DEMO = "demo1234";

export const usuarios: Usuario[] = [
  { id: "u1", nombre: "Marcela Fuentes", correo: "direccion@ejemplo.cl", rol: "Direccion" },
  { id: "u2", nombre: "Andrea Soto", correo: "utp@ejemplo.cl", rol: "UTP" },
  { id: "u3", nombre: "Javiera Pinto", correo: "secretaria@ejemplo.cl", rol: "Secretaria" },
];

const NOMBRES = ["Tomás", "Emilia", "Agustín", "Sofía", "Mateo", "Isidora", "Benjamín", "Florencia", "Vicente", "Josefa"];
const APELLIDOS = ["González", "Muñoz", "Rojas", "Díaz", "Pérez", "Soto", "Contreras", "Silva", "Martínez", "Sepúlveda", "Morales", "Araya"];
const MADRES = ["Camila", "Valentina", "Francisca", "Constanza", "Daniela", "Catalina", "Javiera", "Fernanda"];
const PADRES = ["Felipe", "Sebastián", "Rodrigo", "Cristián", "Matías", "Gonzalo", "Ignacio", "Diego"];

// Reparto de estados: más fichas al inicio del ciclo, como en plena captación.
const ESTADOS_SEMILLA: Estado[] = [
  "PreInscrita", "PreInscrita", "PreInscrita", "PreInscrita", "PreInscrita", "PreInscrita",
  "FichaCompleta", "FichaCompleta", "FichaCompleta", "FichaCompleta",
  "EvaluacionAgendada", "EvaluacionAgendada", "EvaluacionAgendada",
  "Evaluada", "Evaluada", "Evaluada",
  "ListaParaFirmar", "ListaParaFirmar",
  "Matriculada", "Matriculada", "Matriculada",
  "EnListaDeEspera", "EnListaDeEspera",
  "Descartada", "Descartada",
];

const AVANZADOS: Estado[] = ["FichaCompleta", "EvaluacionAgendada", "Evaluada", "ListaParaFirmar", "Matriculada", "EnListaDeEspera"];

function rut(cuerpo: number) {
  const c = String(cuerpo);
  return formatearRut(c + digitoVerificador(c));
}

function crear(i: number, estado: Estado, numero: string | null): Matricula {
  const apellido1 = APELLIDOS[i % APELLIDOS.length];
  const apellido2 = APELLIDOS[(i * 5 + 3) % APELLIDOS.length];
  const madre = `${MADRES[i % MADRES.length]} ${apellido2}`;
  const padre = `${PADRES[(i + 3) % PADRES.length]} ${apellido1}`;
  const apoderadoEsMadre = i % 3 !== 0;
  const mes = 1 + (i % 12);
  const dia = 1 + ((i * 7) % 28);
  // Las primeras del arreglo (pre-inscritas) son las más recientes.
  const creada = new Date(2026, 10, 8 - Math.floor(i * 0.55), 9 + (i % 9), (i * 13) % 60);

  const ficha: Record<string, string> = {
    "alumno.nombre": `${NOMBRES[i % NOMBRES.length]} ${apellido1} ${apellido2}`,
    "alumno.rut": rut(26_100_000 + i * 3_517),
    "alumno.fechaNacimiento": `${2021 + (i % 3)}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`,
    "alumno.nivel": establecimiento.niveles[i % 3],
    "alumno.jornada": establecimiento.jornadas[i % 2],
    "apoderado.nombre": apoderadoEsMadre ? madre : padre,
    "apoderado.parentesco": apoderadoEsMadre ? "Madre" : "Padre",
    "apoderado.rut": rut(15_200_000 + i * 41_233),
    "apoderado.telefono": `+56 9 ${String(51_000_000 + i * 173_311).slice(0, 4)} ${String(1_000 + i * 37).slice(-4)}`,
  };
  if (i % 2 === 0) ficha["apoderado.correo"] = `apoderado${i + 1}@correo-ejemplo.cl`;

  if (AVANZADOS.includes(estado)) {
    Object.assign(ficha, {
      "alumno.nacionalidad": "Chilena",
      "alumno.comuna": "Comuna Ejemplo",
      "alumno.domicilio": `Pasaje Los Aromos ${100 + i}`,
      "alumno.procedencia": i % 2 ? "Jardín infantil" : "Sin escolaridad previa",
      "medico.prevision": i % 4 ? "Fonasa" : "Isapre",
      "medico.grupoSanguineo": ["O+", "A+", "B+", "O-"][i % 4],
      "madre.nombre": madre,
      "madre.telefono": `+56 9 ${7000 + i} ${4000 + i}`,
      "padre.nombre": padre,
      "familia.jefeHogar": ["Madre", "Padre", "Ambos"][i % 3],
      "familia.rshInscrito": "Sí",
      "familia.rshTramo": ["40%", "50%", "60%", "70%"][i % 4],
      "req.junaeb": i % 2 ? "Sí" : "No",
    });
  }

  return {
    id: `m${String(i + 1).padStart(3, "0")}`,
    estado,
    fuenteId: fuentes[i % fuentes.length].id,
    creadaEn: creada.toISOString(),
    numero,
    // Las más recientes aún no se han abierto.
    vista: !(estado === "PreInscrita" && i < 4),
    tokenActivo: ["PreInscrita", "FichaCompleta"].includes(estado),
    // Enlace para retomar de ejemplo: /ejemplo/ficha/demo-m001, etc.
    token: `demo-m${String(i + 1).padStart(3, "0")}`,
    tokenVenceEn: new Date(creada.getTime() + 30 * 86_400_000).toISOString(),
    consentimientoSalud: AVANZADOS.includes(estado),
    ficha,
    personasAutorizadas: AVANZADOS.includes(estado)
      ? [{ parentesco: "Abuela", nombre: `Rosa ${apellido2}`, edad: "62", telefono: "+56 9 6123 4567" }]
      : [],
    historialOrigen: [],
  };
}

export function semilla(): Matricula[] {
  let correlativo = 0;
  return ESTADOS_SEMILLA.map((estado, i) => {
    const conNumero = estado === "ListaParaFirmar" || estado === "Matriculada";
    const numero = conNumero ? `${establecimiento.anioEscolar}-${String(++correlativo).padStart(3, "0")}` : null;
    return crear(i, estado, numero);
  });
}
