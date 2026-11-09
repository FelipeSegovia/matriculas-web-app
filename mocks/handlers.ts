// API simulada del panel. Imita las reglas que aplicará el backend real (D03–D06) para que la UI choque con ellas.
import { http, HttpResponse } from "msw";
import { ESTADOS, resumir, type Estado, type Matricula, type Usuario } from "@/lib/matricula";
import { puede, transicionesPermitidas } from "@/lib/permisos";
import { CLAVES_CONTACTO } from "@/lib/ficha";
import { CLAVE_DEMO, establecimiento, fuentes, semilla, usuarios } from "./data";

const CLAVE_DB = "mock-matriculas";

// Guardado en sessionStorage para que los cambios sobrevivan a una recarga de la pestaña.
function cargar(): Matricula[] {
  try {
    const guardado = sessionStorage.getItem(CLAVE_DB);
    if (guardado) return JSON.parse(guardado);
  } catch {}
  return semilla();
}

const db = cargar();

function guardar() {
  try {
    sessionStorage.setItem(CLAVE_DB, JSON.stringify(db));
  } catch {}
}

function usuarioDe(request: Request): Usuario | undefined {
  const id = request.headers.get("Authorization")?.replace("Bearer ", "");
  return usuarios.find((u) => u.id === id);
}

const error = (status: number, mensaje: string) => HttpResponse.json({ mensaje }, { status });

function siguienteNumero() {
  const prefijo = `${establecimiento.anioEscolar}-`;
  const usados = db.filter((m) => m.numero?.startsWith(prefijo)).map((m) => Number(m.numero!.slice(prefijo.length)));
  return `${prefijo}${String(Math.max(0, ...usados) + 1).padStart(3, "0")}`;
}

export const handlers = [
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
    const m = db.find((x) => x.id === params.id);
    if (!m) return error(404, "No existe esa matrícula.");
    if (!m.vista) {
      m.vista = true;
      guardar();
    }
    return HttpResponse.json(m);
  }),

  http.patch("/api/matriculas/:id", async ({ request, params }) => {
    const usuario = usuarioDe(request);
    if (!usuario) return error(401, "Sesión expirada.");
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
    guardar();
    return HttpResponse.json(m);
  }),

  http.post("/api/matriculas/:id/estado", async ({ request, params }) => {
    const usuario = usuarioDe(request);
    if (!usuario) return error(401, "Sesión expirada.");
    const m = db.find((x) => x.id === params.id);
    if (!m) return error(404, "No existe esa matrícula.");
    const { estado } = (await request.json()) as { estado: Estado };
    if (!ESTADOS.includes(estado) || !transicionesPermitidas(usuario.rol, m.estado).includes(estado)) {
      return error(409, "Ese cambio de estado no está permitido.");
    }
    m.estado = estado;
    if (estado === "ListaParaFirmar" && !m.numero) m.numero = siguienteNumero();
    if (estado === "EvaluacionAgendada") m.tokenActivo = false;
    guardar();
    return HttpResponse.json(m);
  }),

  http.post("/api/matriculas/:id/origen", async ({ request, params }) => {
    const usuario = usuarioDe(request);
    if (!usuario) return error(401, "Sesión expirada.");
    if (!puede(usuario.rol, "cambiarOrigen")) return error(403, "Solo Dirección puede cambiar el origen.");
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
    guardar();
    return HttpResponse.json(m);
  }),
];
