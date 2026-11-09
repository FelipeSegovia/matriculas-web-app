// API simulada. Imita las reglas que aplicará el backend real (D03–D06, D09, D12) para que la UI choque con ellas.
import { http, HttpResponse } from "msw";
import { ESTADOS, resumir, type Estado, type Matricula, type Usuario } from "@/lib/matricula";
import { puede, transicionesPermitidas } from "@/lib/permisos";
import { CAMPOS, CLAVES_CONTACTO, limpiarFicha, validarCampos } from "@/lib/ficha";
import { CLAVES_SALUD, PASOS } from "@/lib/fichaPublica";
import { formatearRut } from "@/lib/rut";
import { CLAVE_DEMO, establecimiento, fuentes, semilla, usuarios } from "./data";

const CLAVE_DB = "mock-matriculas";
const DIAS_TOKEN = 30;

// Guardado en localStorage: sobrevive a recargas y lo comparten el formulario y el panel abiertos en otras pestañas.
// Se relee en cada petición para ver lo que escribió la otra pestaña.
function leer(): Matricula[] {
  try {
    const guardado = localStorage.getItem(CLAVE_DB);
    if (guardado) return JSON.parse(guardado);
  } catch {}
  return semilla();
}

function guardar(db: Matricula[]) {
  try {
    localStorage.setItem(CLAVE_DB, JSON.stringify(db));
  } catch {}
}

function usuarioDe(request: Request): Usuario | undefined {
  const id = request.headers.get("Authorization")?.replace("Bearer ", "");
  return usuarios.find((u) => u.id === id);
}

const error = (status: number, mensaje: string) => HttpResponse.json({ mensaje }, { status });

function siguienteNumero(db: Matricula[]) {
  const prefijo = `${establecimiento.anioEscolar}-`;
  const usados = db.filter((m) => m.numero?.startsWith(prefijo)).map((m) => Number(m.numero!.slice(prefijo.length)));
  return `${prefijo}${String(Math.max(0, ...usados) + 1).padStart(3, "0")}`;
}

/** Lo que ve el apoderado de su ficha: sin origen, N° ni historial. */
function fichaPublica(m: Matricula) {
  return {
    ficha: m.ficha,
    personasAutorizadas: m.personasAutorizadas,
    consentimientoSalud: !!m.consentimientoSalud,
    enviada: m.estado !== "PreInscrita",
  };
}

function porToken(db: Matricula[], token: string) {
  const m = db.find((x) => x.token === token);
  if (!m) return { error: error(404, "No encontramos esta ficha. Revise que el enlace esté completo.") };
  if (!m.tokenActivo || (m.tokenVenceEn && new Date(m.tokenVenceEn) < new Date()))
    return { error: error(410, "Este enlace ya no está activo. La escuela está revisando su ficha y le contactará.") };
  return { m };
}

const handlersPanel = [
  http.post("/api/auth/login", async ({ request }) => {
    const { correo, clave } = (await request.json()) as { correo: string; clave: string };
    const usuario = usuarios.find((u) => u.correo === correo.trim().toLowerCase());
    if (!usuario || clave !== CLAVE_DEMO) return error(401, "Correo o contraseña incorrectos.");
    return HttpResponse.json({ token: usuario.id, usuario });
  }),

  http.get("/api/establecimiento", () => HttpResponse.json(establecimiento)),

  http.get("/api/fuentes", () => HttpResponse.json(fuentes)),

  http.get("/api/matriculas", ({ request }) => {
    if (!usuarioDe(request)) return error(401, "Sesión expirada.");
    const db = leer();
    const q = new URL(request.url).searchParams;
    const fuente = q.get("fuente");
    const estado = q.get("estado");
    const nivel = q.get("nivel");
    const desde = q.get("desde");
    const hasta = q.get("hasta");
    const items = db
      .filter((m) => !fuente || m.fuenteId === fuente)
      .filter((m) => !estado || m.estado === estado)
      .filter((m) => !nivel || m.ficha["alumno.nivel"] === nivel)
      .filter((m) => !desde || m.creadaEn.slice(0, 10) >= desde)
      .filter((m) => !hasta || m.creadaEn.slice(0, 10) <= hasta)
      .sort((a, b) => b.creadaEn.localeCompare(a.creadaEn))
      .map(resumir);
    return HttpResponse.json({ items, nuevas: db.filter((m) => !m.vista).length });
  }),

  http.get("/api/matriculas/:id", ({ request, params }) => {
    if (!usuarioDe(request)) return error(401, "Sesión expirada.");
    const db = leer();
    const m = db.find((x) => x.id === params.id);
    if (!m) return error(404, "No existe esa matrícula.");
    if (!m.vista) {
      m.vista = true;
      guardar(db);
    }
    return HttpResponse.json(m);
  }),

  http.patch("/api/matriculas/:id", async ({ request, params }) => {
    const usuario = usuarioDe(request);
    if (!usuario) return error(401, "Sesión expirada.");
    const db = leer();
    const m = db.find((x) => x.id === params.id);
    if (!m) return error(404, "No existe esa matrícula.");
    const cambios = (await request.json()) as Pick<Matricula, "ficha" | "personasAutorizadas">;
    if (puede(usuario.rol, "editarFicha")) {
      m.ficha = cambios.ficha;
      m.personasAutorizadas = cambios.personasAutorizadas;
    } else if (puede(usuario.rol, "editarContacto")) {
      for (const clave of CLAVES_CONTACTO) m.ficha[clave] = cambios.ficha[clave] ?? "";
    } else {
      return error(403, "Su rol no puede editar la ficha.");
    }
    guardar(db);
    return HttpResponse.json(m);
  }),

  http.post("/api/matriculas/:id/estado", async ({ request, params }) => {
    const usuario = usuarioDe(request);
    if (!usuario) return error(401, "Sesión expirada.");
    const db = leer();
    const m = db.find((x) => x.id === params.id);
    if (!m) return error(404, "No existe esa matrícula.");
    const { estado } = (await request.json()) as { estado: Estado };
    if (!ESTADOS.includes(estado) || !transicionesPermitidas(usuario.rol, m.estado).includes(estado)) {
      return error(409, "Ese cambio de estado no está permitido.");
    }
    m.estado = estado;
    if (estado === "ListaParaFirmar" && !m.numero) m.numero = siguienteNumero(db);
    if (estado === "EvaluacionAgendada") m.tokenActivo = false;
    guardar(db);
    return HttpResponse.json(m);
  }),

  http.post("/api/matriculas/:id/origen", async ({ request, params }) => {
    const usuario = usuarioDe(request);
    if (!usuario) return error(401, "Sesión expirada.");
    if (!puede(usuario.rol, "cambiarOrigen")) return error(403, "Solo Dirección puede cambiar el origen.");
    const db = leer();
    const m = db.find((x) => x.id === params.id);
    if (!m) return error(404, "No existe esa matrícula.");
    const { fuenteId, motivo } = (await request.json()) as { fuenteId: string; motivo: string };
    const nueva = fuentes.find((f) => f.id === fuenteId);
    if (!nueva) return error(400, "La fuente no existe.");
    if (nueva.id === m.fuenteId) return error(400, "La matrícula ya tiene ese origen.");
    if (!motivo?.trim()) return error(400, "Indique el motivo del cambio.");
    m.historialOrigen.push({
      fecha: new Date().toISOString(),
      usuario: usuario.nombre,
      anterior: fuentes.find((f) => f.id === m.fuenteId)?.nombre ?? m.fuenteId,
      nuevo: nueva.nombre,
      motivo: motivo.trim(),
    });
    m.fuenteId = nueva.id;
    guardar(db);
    return HttpResponse.json(m);
  }),
];

// Formulario del apoderado: sin sesión. Se identifica por la escuela (slug) y, después del paso 1, por el token.
const handlersPublicos = [
  http.get("/api/publico/escuelas/:slug", ({ params }) => {
    if (params.slug !== establecimiento.slug) return error(404, "No encontramos esta escuela.");
    const { nombre, direccion, color, anioEscolar, niveles, jornadas, slug } = establecimiento;
    return HttpResponse.json({ slug, nombre, direccion, color, anioEscolar, niveles, jornadas });
  }),

  http.post("/api/publico/escuelas/:slug/inscripciones", async ({ request, params }) => {
    if (params.slug !== establecimiento.slug) return error(404, "No encontramos esta escuela.");
    const datos = (await request.json()) as { ficha: Record<string, string>; ref?: string; comoSupo?: string; aceptaPrivacidad: boolean };
    if (!datos.aceptaPrivacidad) return error(400, "Debe aceptar el aviso de privacidad para inscribir.");
    if (Object.keys(validarCampos(PASOS[0].campos, datos.ficha)).length) return error(400, "Revise los datos del paso 1.");

    const db = leer();
    const ficha = limpiarFicha(datos.ficha);
    // El primer origen manda (D04): si el RUT ya existe, no se crea otra ficha ni cambia el origen.
    if (db.some((m) => formatearRut(m.ficha["alumno.rut"] ?? "") === ficha["alumno.rut"])) {
      return error(409, "Este alumno(a) ya tiene una inscripción en la escuela. La escuela le contactará; si necesita cambiar algo, use el enlace que recibió al inscribirlo.");
    }
    // Un código desconocido cuenta como orgánico: sin código válido no hay comisión.
    const fuente = fuentes.find((f) => f.codigo === datos.ref?.toUpperCase()) ?? fuentes.find((f) => f.tipo === "Organico")!;
    if (datos.comoSupo && fuente.tipo === "Organico") ficha["origen.comoSupo"] = datos.comoSupo;

    const ahora = new Date();
    const token = crypto.randomUUID();
    db.push({
      id: `m${String(db.length + 1).padStart(3, "0")}`,
      estado: "PreInscrita",
      fuenteId: fuente.id,
      creadaEn: ahora.toISOString(),
      numero: null,
      vista: false,
      tokenActivo: true,
      token,
      tokenVenceEn: new Date(ahora.getTime() + DIAS_TOKEN * 86_400_000).toISOString(),
      consentimientoSalud: false,
      ficha,
      personasAutorizadas: [],
      historialOrigen: [],
    });
    guardar(db);
    return HttpResponse.json({ token }, { status: 201 });
  }),

  http.get("/api/publico/fichas/:token", ({ params }) => {
    const { m, error: e } = porToken(leer(), String(params.token));
    return e ?? HttpResponse.json(fichaPublica(m));
  }),

  http.patch("/api/publico/fichas/:token", async ({ request, params }) => {
    const db = leer();
    const { m, error: e } = porToken(db, String(params.token));
    if (e) return e;
    const datos = (await request.json()) as {
      ficha: Record<string, string>;
      personasAutorizadas: Matricula["personasAutorizadas"];
      consentimientoSalud: boolean;
      enviar?: boolean;
    };
    const ficha = limpiarFicha(datos.ficha);
    if (Object.keys(validarCampos(CAMPOS.filter((c) => !c.soloEscuela), ficha)).length) return error(400, "Revise los datos marcados.");
    // El RUT del alumno no cambia (es la llave de duplicados) y los campos de la escuela no los toca el apoderado.
    for (const c of CAMPOS) {
      if (c.soloEscuela || c.clave === "alumno.rut") continue;
      m.ficha[c.clave] = ficha[c.clave] ?? "";
    }
    // Sin consentimiento de salud (D12) no se guarda ningún dato médico.
    m.consentimientoSalud = datos.consentimientoSalud;
    if (!m.consentimientoSalud) for (const clave of CLAVES_SALUD) m.ficha[clave] = "";
    m.personasAutorizadas = datos.personasAutorizadas.filter((p) => p.nombre.trim());
    if (datos.enviar && m.estado === "PreInscrita") m.estado = "FichaCompleta";
    guardar(db);
    return HttpResponse.json(fichaPublica(m));
  }),
];

export const handlers = [...handlersPanel, ...handlersPublicos];
