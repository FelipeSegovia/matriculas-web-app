"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Casilla } from "@/components/molecules/Casilla";
import { CampoFicha } from "@/components/molecules/CampoFicha";
import { FormField } from "@/components/molecules/FormField";
import { Modal } from "@/components/molecules/Modal";
import { OpcionesChips } from "@/components/molecules/OpcionesChips";
import { Progreso } from "@/components/molecules/Progreso";
import { useActualizarFichaPublica, useCrearInscripcion } from "@/hooks/useInscripcion";
import { limpiarFicha, validarCampos, type Campo } from "@/lib/ficha";
import { COMO_SUPO, PASOS, PASO_SALUD, numeroWhatsapp, opcionesDe, textoDe } from "@/lib/fichaPublica";
import { edadActual, edadAMarzo, type PersonaAutorizada } from "@/lib/matricula";
import type { Establecimiento } from "@/services/establecimiento";
import type { FichaPublica } from "@/services/inscripcion";

type Modo = { tipo: "nueva"; ref?: string } | { tipo: "retomar"; token: string; inicial: FichaPublica; pasoInicial: number };

type Props = { escuela: Establecimiento; modo: Modo };

const PERSONA_VACIA: PersonaAutorizada = { parentesco: "", nombre: "", edad: "", telefono: "" };

const AUTOCOMPLETAR: Record<string, string> = {
  "apoderado.nombre": "name",
  "apoderado.telefono": "tel",
  "apoderado.correo": "email",
};

function enlaceRetomar(slug: string, token: string) {
  return `${window.location.origin}/${slug}/ficha/${token}`;
}

function enlaceWhatsapp(telefono: string, escuela: string, enlace: string) {
  const texto = encodeURIComponent(`Mi enlace para completar la ficha de matrícula en ${escuela}: ${enlace}`);
  const numero = numeroWhatsapp(telefono);
  return `https://wa.me/${numero ?? ""}?text=${texto}`;
}

export function FormularioInscripcion({ escuela, modo }: Props) {
  const router = useRouter();
  const retomando = modo.tipo === "retomar";
  const crear = useCrearInscripcion(escuela.slug);
  const actualizar = useActualizarFichaPublica(retomando ? modo.token : "");

  const [paso, setPaso] = useState(retomando ? modo.pasoInicial : 0);
  const [ficha, setFicha] = useState<Record<string, string>>(retomando ? modo.inicial.ficha : {});
  const [personas, setPersonas] = useState(retomando ? modo.inicial.personasAutorizadas : []);
  const [salud, setSalud] = useState(retomando ? modo.inicial.consentimientoSalud : false);
  const [privacidad, setPrivacidad] = useState(false);
  const [comoSupo, setComoSupo] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [verAviso, setVerAviso] = useState(false);
  const [vista, setVista] = useState<"paso" | "confirmacion" | "enviada">("paso");
  const [token, setToken] = useState(retomando ? modo.token : "");

  const actual = PASOS[paso];
  const ultimo = paso === PASOS.length - 1;
  const mutacion = retomando ? actualizar : crear;

  function cambiar(clave: string, valor: string) {
    setFicha((f) => ({ ...f, [clave]: valor }));
    if (errores[clave])
      setErrores((es) => {
        const resto = { ...es };
        delete resto[clave];
        return resto;
      });
  }

  function irA(i: number) {
    setErrores({});
    mutacion.reset();
    setPaso(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validarPaso() {
    const encontrados = validarCampos(actual.campos, ficha);
    if (paso === 0 && !retomando && !privacidad) encontrados.privacidad = "Para inscribir debe aceptar el aviso de privacidad.";
    setErrores(encontrados);
    const primero = Object.keys(encontrados)[0];
    if (primero) document.getElementById(primero)?.focus();
    return !primero;
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!validarPaso()) return;
    if (!retomando) {
      crear.mutate(
        { ficha: limpiarFicha(ficha), ref: modo.ref, comoSupo: modo.ref ? undefined : comoSupo || undefined, aceptaPrivacidad: privacidad },
        {
          onSuccess: (r) => {
            setToken(r.token);
            setVista("confirmacion");
            window.scrollTo({ top: 0 });
          },
        },
      );
      return;
    }
    actualizar.mutate(
      { ficha: limpiarFicha(ficha), personasAutorizadas: personas, consentimientoSalud: salud, enviar: ultimo },
      {
        onSuccess: (f) => {
          setFicha(f.ficha);
          setPersonas(f.personasAutorizadas);
          if (ultimo) {
            setVista("enviada");
            window.scrollTo({ top: 0 });
          } else irA(paso + 1);
        },
      },
    );
  }

  function soyYo(quien: "madre" | "padre") {
    setFicha((f) => ({
      ...f,
      [`${quien}.nombre`]: f["apoderado.nombre"] ?? "",
      [`${quien}.rut`]: f["apoderado.rut"] ?? "",
      [`${quien}.telefono`]: f["apoderado.telefono"] ?? "",
    }));
  }

  function campo(c: Campo) {
    const t = textoDe(c);
    return (
      <div key={c.clave} className={c.tipo === "area" || c.ancho === "completo" || c.tipo === "seleccion" ? "sm:col-span-2" : ""}>
        <CampoFicha
          id={c.clave}
          tipo={c.tipo}
          etiqueta={t.etiqueta}
          ayuda={t.ayuda}
          placeholder={t.placeholder}
          opciones={opcionesDe(c, escuela)}
          valor={ficha[c.clave] ?? ""}
          onCambiar={(v) => cambiar(c.clave, v)}
          error={errores[c.clave]}
          obligatorio={c.obligatorio}
          autoComplete={AUTOCOMPLETAR[c.clave]}
          // El RUT del alumno identifica la inscripción; si está mal, lo corrige la escuela.
          deshabilitado={(retomando && c.clave === "alumno.rut") || (paso === PASO_SALUD && !salud)}
        />
      </div>
    );
  }

  if (vista === "confirmacion") {
    const enlace = enlaceRetomar(escuela.slug, token);
    return (
      <section aria-labelledby="tit-ok" className="flex flex-col gap-5 rounded-(--radius-block) bg-white p-6 shadow-(--shadow-float) sm:p-9">
        <span aria-hidden="true" className="grid size-14 place-items-center rounded-[28px_28px_28px_8px] bg-mint text-ink">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.5 12.5 10 17l8.5-9.5" />
          </svg>
        </span>
        <h1 id="tit-ok" className="text-3xl sm:text-4xl">
          Su inscripción quedó guardada
        </h1>
        <p className="text-lg text-ink-2">
          {ficha["alumno.nombre"]} ya está pre-inscrito(a) en {escuela.nombre}. La escuela le contactará al {ficha["apoderado.telefono"]}.
        </p>
        <div className="bubble-bl flex flex-col gap-3 bg-school-soft p-5">
          <p className="font-bold text-school-deep">Guarde este enlace para completar el resto de la ficha cuando quiera</p>
          <FormField etiqueta="Su enlace" htmlFor="enlace" ayuda="Funciona por 30 días, o hasta que la escuela agende la evaluación.">
            <Input id="enlace" readOnly value={enlace} onFocus={(e) => e.target.select()} aria-describedby="enlace-msg" />
          </FormField>
          <a
            href={enlaceWhatsapp(ficha["apoderado.telefono"] ?? "", escuela.nombre, enlace)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[20px] bg-[#1f8f4e] px-6 font-display font-semibold text-white no-underline hover:bg-[#18723e]"
          >
            Enviarme el enlace por WhatsApp
          </a>
        </div>
        <p className="text-ink-2">
          Son 8 pasos más, todos opcionales. Mientras más complete, menos tendrá que llenar en la escuela: solo irá a firmar.
        </p>
        <Button onClick={() => router.push(`/${escuela.slug}/ficha/${token}?paso=2`)}>Seguir con el paso 2</Button>
      </section>
    );
  }

  if (vista === "enviada")
    return (
      <section aria-labelledby="tit-fin" className="flex flex-col gap-5 rounded-(--radius-block) bg-white p-6 shadow-(--shadow-float) sm:p-9">
        <span aria-hidden="true" className="bubble-bl w-fit bg-sun px-4 py-2 font-display text-xl font-semibold text-ink">
          ¡Listo!
        </span>
        <h1 id="tit-fin" className="text-3xl sm:text-4xl">
          Su ficha llegó a la escuela
        </h1>
        <p className="text-lg text-ink-2">La escuela revisa su ficha y le avisa por WhatsApp cuándo ir a firmar. Solo tiene que llevar su carnet.</p>
        <p className="text-ink-2">Si necesita corregir algo, puede volver con el mismo enlace mientras la escuela no agende la evaluación.</p>
        <Button
          variante="suave"
          onClick={() => {
            setVista("paso");
            irA(0);
          }}
        >
          Revisar mi ficha
        </Button>
      </section>
    );

  const nacimiento = ficha["alumno.fechaNacimiento"] ?? "";
  const edad = edadActual(nacimiento);
  const edadMarzo = edadAMarzo(nacimiento, escuela.anioEscolar);

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-6">
      {paso === 0 && !retomando && (
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl sm:text-5xl">Ficha de matrícula {escuela.anioEscolar}</h1>
          <p className="text-lg text-ink-2">
            Son 9 pasos cortos. <b>Solo el primero es obligatorio</b>: con él su hijo(a) ya queda pre-inscrito(a). El resto lo puede completar
            ahora o después, con el enlace que le daremos.
          </p>
          <p className="bubble-bl w-fit bg-sun/40 px-4 py-2 text-sm font-bold text-ink">Tenga a mano su RUT y el del alumno(a).</p>
        </div>
      )}

      {retomando && (
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl">Ficha de {ficha["alumno.nombre"] || "matrícula"}</h1>
          <p className="text-ink-2">Todos los pasos son opcionales. Puede saltar entre ellos con la barra.</p>
        </div>
      )}

      <Progreso actual={paso} titulos={PASOS.map((p) => p.titulo)} onIr={retomando ? irA : undefined} />

      <section aria-labelledby="tit-paso" className="flex flex-col gap-5 rounded-(--radius-card) bg-white p-5 shadow-(--shadow-soft) sm:p-7">
        <div className="flex flex-col gap-1">
          <span className={`bubble-bl w-fit px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${paso === 0 ? "bg-school text-white" : "bg-ground text-muted"}`}>
            {paso === 0 ? "Obligatorio" : "Opcional"}
          </span>
          <h2 id="tit-paso" className="mt-2 text-2xl sm:text-3xl" tabIndex={-1}>
            {actual.titulo}
          </h2>
          <p className="text-ink-2">{actual.bajada}</p>
        </div>

        {paso === PASO_SALUD && (
          <Casilla id="consentimiento-salud" checked={salud} onChange={(e) => setSalud(e.target.checked)}>
            Autorizo a la escuela a guardar los datos de salud de mi hijo(a). Si no marca esta casilla, no guardamos nada de este paso.
          </Casilla>
        )}

        {(actual.id === "madre" || actual.id === "padre") && (
          <Button variante="suave" tamano="sm" className="w-fit" onClick={() => soyYo(actual.id as "madre" | "padre")}>
            Soy yo: usar mis datos del paso 1
          </Button>
        )}

        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          {actual.campos.map(campo)}
          {paso === 0 && nacimiento && (
            <p className="flex flex-wrap gap-2 sm:col-span-2" aria-live="polite">
              <span className="bubble-bl bg-school-soft px-4 py-2 text-sm font-bold text-school-deep">Edad: {edad ?? "—"} años</span>
              <span className="bubble-bl bg-mint/60 px-4 py-2 text-sm font-bold text-ink">
                Al 31 de marzo de {escuela.anioEscolar}: {edadMarzo ?? "—"} años
              </span>
            </p>
          )}
        </div>

        {actual.id === "autorizadas" && (
          <div className="flex flex-col gap-4">
            {personas.map((p, j) => (
              <fieldset key={j} className="grid gap-3 rounded-2xl bg-ground p-4 sm:grid-cols-2">
                <legend className="sr-only">Persona autorizada {j + 1}</legend>
                {(["nombre", "parentesco", "telefono", "edad"] as const).map((k) => (
                  <CampoFicha
                    key={k}
                    id={`pa-${j}-${k}`}
                    tipo={k === "telefono" ? "telefono" : k === "edad" ? "numero" : "texto"}
                    etiqueta={{ nombre: "Nombre completo", parentesco: "Parentesco", telefono: "Celular", edad: "Edad" }[k]}
                    valor={p[k]}
                    onCambiar={(v) => setPersonas((ps) => ps.map((x, i) => (i === j ? { ...x, [k]: v } : x)))}
                  />
                ))}
                <Button variante="peligro" tamano="sm" className="w-fit sm:col-span-2" onClick={() => setPersonas((ps) => ps.filter((_, i) => i !== j))}>
                  Quitar a esta persona
                </Button>
              </fieldset>
            ))}
            <Button variante="suave" className="w-fit" onClick={() => setPersonas((ps) => [...ps, PERSONA_VACIA])}>
              + Agregar una persona
            </Button>
          </div>
        )}

        {paso === 0 && !retomando && (
          <div className="flex flex-col gap-5">
            {!modo.ref && (
              <OpcionesChips nombre="como-supo" leyenda="¿Cómo supo de nosotros?" opciones={COMO_SUPO} valor={comoSupo} onCambiar={setComoSupo} />
            )}
            <Casilla id="privacidad" checked={privacidad} onChange={(e) => setPrivacidad(e.target.checked)} error={errores.privacidad}>
              Acepto el tratamiento de mis datos según el{" "}
              <button type="button" className="font-bold text-school-deep underline underline-offset-2" onClick={() => setVerAviso(true)}>
                aviso de privacidad
              </button>
            </Casilla>
          </div>
        )}
      </section>

      <div className="flex flex-col gap-3">
        <p aria-live="polite" className="text-sm font-semibold text-danger empty:hidden">
          {mutacion.error?.message ?? (Object.keys(errores).length ? "Revise los campos marcados." : "")}
        </p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {paso > 0 ? (
            <Button variante="blanco" onClick={() => irA(paso - 1)}>
              Volver
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={mutacion.isPending}>
            {mutacion.isPending ? "Guardando…" : ultimo ? "Enviar ficha" : paso === 0 && !retomando ? "Guardar inscripción" : "Guardar y seguir"}
          </Button>
        </div>
      </div>

      <Modal abierto={verAviso} titulo="Aviso de privacidad" onCerrar={() => setVerAviso(false)}>
        <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto text-ink-2">
          <p>
            <b>Responsable:</b> {escuela.nombre}. <b>Encargado del tratamiento:</b> el proveedor del sistema de matrícula.
          </p>
          <p>
            <b>Para qué usamos sus datos:</b> el proceso de matrícula, la evaluación fonoaudiológica y el contacto con su familia.
          </p>
          <p>
            <b>Dónde se guardan:</b> en servidores ubicados en Estados Unidos.
          </p>
          <p>
            <b>Sus derechos:</b> puede pedir acceso, rectificación, eliminación u oposición al tratamiento de sus datos ante la escuela.
          </p>
          <p>Los datos de salud del paso 3 se guardan solo si usted lo autoriza en ese paso.</p>
          {process.env.NODE_ENV === "development" && (
            <p className="rounded-2xl bg-sun/40 px-4 py-2 text-sm font-bold text-ink">Borrador (D12): pendiente de revisión legal.</p>
          )}
        </div>
        <Button onClick={() => setVerAviso(false)}>Entendido</Button>
      </Modal>
    </form>
  );
}
