"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Textarea } from "@/components/atoms/Textarea";
import { FormField } from "@/components/molecules/FormField";
import { useActualizarMatricula } from "@/hooks/useEditarMatricula";
import { CAMPOS, SECCIONES, limpiarFicha, validarCampos, type Campo } from "@/lib/ficha";
import { edadActual, edadAMarzo, type Matricula, type PersonaAutorizada, type Rol } from "@/lib/matricula";
import { puede } from "@/lib/permisos";
import type { Establecimiento } from "@/services/establecimiento";

const TIPO_INPUT: Partial<Record<Campo["tipo"], string>> = {
  fecha: "date",
  telefono: "tel",
  correo: "email",
  numero: "number",
};

const PERSONA_VACIA: PersonaAutorizada = { parentesco: "", nombre: "", edad: "", telefono: "" };

type Props = { matricula: Matricula; establecimiento: Establecimiento; rol: Rol };

export function FichaMatriculaForm({ matricula, establecimiento, rol }: Props) {
  const guardar = useActualizarMatricula(matricula.id);
  const [ficha, setFicha] = useState(matricula.ficha);
  const [personas, setPersonas] = useState(matricula.personasAutorizadas);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [guardado, setGuardado] = useState(false);

  const editaTodo = puede(rol, "editarFicha");
  const editaContacto = puede(rol, "editarContacto");
  const editable = (c: Campo) => editaTodo || (editaContacto && !!c.contacto);
  const sucio =
    JSON.stringify(ficha) !== JSON.stringify(matricula.ficha) ||
    JSON.stringify(personas) !== JSON.stringify(matricula.personasAutorizadas);

  function cambiar(clave: string, valor: string) {
    setFicha((f) => ({ ...f, [clave]: valor }));
    setGuardado(false);
    if (errores[clave])
      setErrores((es) => {
        const resto = { ...es };
        delete resto[clave];
        return resto;
      });
  }

  function cambiarPersona(i: number, campo: keyof PersonaAutorizada, valor: string) {
    setPersonas((ps) => ps.map((p, j) => (j === i ? { ...p, [campo]: valor } : p)));
    setGuardado(false);
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    const encontrados = validarCampos(CAMPOS, ficha);
    setErrores(encontrados);
    const primero = Object.keys(encontrados)[0];
    if (primero) {
      document.getElementById(primero)?.focus();
      return;
    }
    guardar.mutate(
      { ficha: limpiarFicha(ficha), personasAutorizadas: personas.filter((p) => p.nombre.trim()) },
      {
        onSuccess: (m) => {
          setFicha(m.ficha);
          setPersonas(m.personasAutorizadas);
          setGuardado(true);
        },
      },
    );
  }

  function opciones(c: Campo) {
    const lista = c.opciones === "niveles" ? establecimiento.niveles : c.opciones === "jornadas" ? establecimiento.jornadas : (c.opciones ?? []);
    return lista.map((o) => ({ valor: o, etiqueta: o }));
  }

  function control(c: Campo) {
    const comunes = {
      id: c.clave,
      value: ficha[c.clave] ?? "",
      disabled: !editable(c),
      "aria-invalid": errores[c.clave] ? true : undefined,
      "aria-describedby": errores[c.clave] ? `${c.clave}-msg` : undefined,
    };
    if (c.tipo === "seleccion")
      return <Select {...comunes} vacio="Sin dato" opciones={opciones(c)} onChange={(e) => cambiar(c.clave, e.target.value)} />;
    if (c.tipo === "area") return <Textarea {...comunes} onChange={(e) => cambiar(c.clave, e.target.value)} />;
    return (
      <Input
        {...comunes}
        type={TIPO_INPUT[c.tipo] ?? "text"}
        inputMode={c.tipo === "rut" ? "text" : undefined}
        placeholder={c.tipo === "rut" ? "12.345.678-5" : undefined}
        onChange={(e) => cambiar(c.clave, e.target.value)}
      />
    );
  }

  const nacimiento = ficha["alumno.fechaNacimiento"] ?? "";
  const edad = edadActual(nacimiento);
  const edadMarzo = edadAMarzo(nacimiento, establecimiento.anioEscolar);

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-6">
      {!editaTodo && (
        <p className="bubble-bl bg-sun/35 px-5 py-3 text-sm font-semibold text-ink">
          Con su rol puede editar solo los datos de contacto. El resto de la ficha lo edita Dirección o UTP.
        </p>
      )}

      <nav aria-label="Secciones de la ficha" className="flex gap-2 overflow-x-auto pb-1">
        {[...SECCIONES.slice(0, 7), { id: "autorizadas", titulo: "8. Autorizados" }, SECCIONES[7]].map((s) => (
          <a
            key={s.id}
            href={`#sec-${s.id}`}
            className="bubble-bl shrink-0 bg-white px-3.5 py-1.5 text-sm font-bold whitespace-nowrap text-ink-2 no-underline ring-1 ring-line hover:bg-school-soft hover:text-school-deep"
          >
            {s.titulo}
          </a>
        ))}
      </nav>

      {SECCIONES.map((s, i) => (
        <div key={s.id} className="contents">
          <section id={`sec-${s.id}`} aria-labelledby={`tit-${s.id}`} className="scroll-mt-6 rounded-(--radius-card) bg-white p-5 shadow-(--shadow-soft) sm:p-7">
            <h2 id={`tit-${s.id}`} className="mb-5 text-xl text-school-deep">
              {s.titulo}
            </h2>
            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
              {s.campos.map((c) => (
                <FormField
                  key={c.clave}
                  etiqueta={c.etiqueta}
                  htmlFor={c.clave}
                  obligatorio={c.obligatorio}
                  error={errores[c.clave]}
                  className={c.ancho === "completo" || c.tipo === "area" ? "sm:col-span-2" : ""}
                >
                  {control(c)}
                </FormField>
              ))}
              {s.id === "basicos" && (
                <div className="flex gap-3 sm:col-span-2" aria-live="polite">
                  <span className="bubble-bl bg-school-soft px-4 py-2 text-sm font-bold text-school-deep">
                    Edad actual: {edad === null ? "—" : `${edad} años`}
                  </span>
                  <span className="bubble-bl bg-mint/60 px-4 py-2 text-sm font-bold text-ink">
                    Edad al 31 de marzo de {establecimiento.anioEscolar}: {edadMarzo === null ? "—" : `${edadMarzo} años`}
                  </span>
                </div>
              )}
            </div>
          </section>

          {i === 6 && (
            <section id="sec-autorizadas" aria-labelledby="tit-autorizadas" className="scroll-mt-6 rounded-(--radius-card) bg-white p-5 shadow-(--shadow-soft) sm:p-7">
              <h2 id="tit-autorizadas" className="mb-5 text-xl text-school-deep">
                8. Personas autorizadas a retirar
              </h2>
              {personas.length === 0 && <p className="mb-4 text-muted">No hay personas registradas.</p>}
              <ul className="flex flex-col gap-4">
                {personas.map((p, j) => (
                  <li key={j} className="grid gap-3 rounded-2xl bg-ground p-4 sm:grid-cols-[1fr_2fr_0.6fr_1.2fr_auto] sm:items-end">
                    {(["parentesco", "nombre", "edad", "telefono"] as const).map((campo) => (
                      <FormField key={campo} etiqueta={{ parentesco: "Parentesco", nombre: "Nombre", edad: "Edad", telefono: "Teléfono" }[campo]} htmlFor={`pa-${j}-${campo}`}>
                        <Input
                          id={`pa-${j}-${campo}`}
                          value={p[campo]}
                          disabled={!editaTodo}
                          type={campo === "telefono" ? "tel" : campo === "edad" ? "number" : "text"}
                          onChange={(e) => cambiarPersona(j, campo, e.target.value)}
                        />
                      </FormField>
                    ))}
                    {editaTodo && (
                      <Button variante="peligro" tamano="sm" onClick={() => setPersonas((ps) => ps.filter((_, k) => k !== j))} aria-label={`Quitar a ${p.nombre || "esta persona"}`}>
                        Quitar
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
              {editaTodo && (
                <Button variante="suave" tamano="sm" className="mt-4" onClick={() => setPersonas((ps) => [...ps, PERSONA_VACIA])}>
                  Agregar persona
                </Button>
              )}
            </section>
          )}
        </div>
      ))}

      {(editaTodo || editaContacto) && (sucio || guardado || guardar.isError || Object.keys(errores).length > 0) && (
        <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-4 rounded-(--radius-card) bg-ink px-5 py-4 text-white shadow-(--shadow-float) [--focus:#fff]">
          <p aria-live="polite" className="mr-auto text-sm font-semibold text-on-ink">
            {guardar.isError
              ? guardar.error.message
              : Object.keys(errores).length
                ? "Revise los campos marcados."
                : guardado
                  ? "Cambios guardados."
                  : "Tiene cambios sin guardar."}
          </p>
          <Button type="submit" variante="color" disabled={!sucio || guardar.isPending}>
            {guardar.isPending ? "Guardando…" : "Guardar cambios"}
          </Button>
        </div>
      )}
    </form>
  );
}
