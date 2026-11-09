"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { Select } from "@/components/atoms/Select";
import { Textarea } from "@/components/atoms/Textarea";
import { FormField } from "@/components/molecules/FormField";
import { Modal } from "@/components/molecules/Modal";
import { useCambiarOrigen } from "@/hooks/useEditarMatricula";
import { formatearFecha } from "@/lib/estadoUi";
import type { Fuente, Matricula, Rol, TipoFuente } from "@/lib/matricula";
import { puede } from "@/lib/permisos";

const TIPOS: Record<TipoFuente, string> = {
  Promotora: "Promotora",
  Educadora: "Educadora",
  Campana: "Campaña",
  Organico: "Sin código",
};

type Props = { matricula: Matricula; fuentes: Fuente[]; rol: Rol };

export function PanelOrigen({ matricula, fuentes, rol }: Props) {
  const cambiar = useCambiarOrigen(matricula.id);
  const [abierto, setAbierto] = useState(false);
  const [fuenteId, setFuenteId] = useState("");
  const [motivo, setMotivo] = useState("");
  const fuente = fuentes.find((f) => f.id === matricula.fuenteId);

  function cerrar() {
    setAbierto(false);
    setFuenteId("");
    setMotivo("");
    cambiar.reset();
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    cambiar.mutate({ fuenteId, motivo }, { onSuccess: cerrar });
  }

  return (
    <section aria-labelledby="tit-origen" className="rounded-(--radius-card) bg-white p-5 shadow-(--shadow-soft) sm:p-6">
      <h2 id="tit-origen" className="mb-4 text-lg">
        Origen
      </h2>
      <div className="bubble-bl bg-school-soft px-4 py-3">
        <p className="font-display text-lg font-semibold text-school-deep">{fuente?.nombre ?? "—"}</p>
        {fuente && (
          <p className="text-sm text-ink-2">
            {TIPOS[fuente.tipo]} · código <span className="font-bold">{fuente.codigo}</span>
          </p>
        )}
      </div>
      {matricula.ficha["origen.comoSupo"] && (
        <p className="mt-3 text-sm text-ink-2">
          Llegó sin código. El apoderado declaró: <span className="font-bold">«{matricula.ficha["origen.comoSupo"]}»</span>
        </p>
      )}
      <p className="mt-3 text-sm text-muted">El origen se fijó al recibir la pre-inscripción. La comisión se reconoce solo cuando la matrícula llega a «Matriculada».</p>

      {matricula.historialOrigen.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 text-sm font-bold text-ink-2">Cambios de origen</h3>
          <ol className="flex flex-col gap-3">
            {matricula.historialOrigen.map((c, i) => (
              <li key={i} className="border-l-4 border-sun pl-3 text-sm">
                <p className="font-bold">
                  {c.anterior} → {c.nuevo}
                </p>
                <p className="text-ink-2">«{c.motivo}»</p>
                <p className="text-xs text-muted">
                  {c.usuario} · {formatearFecha(c.fecha, true)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {puede(rol, "cambiarOrigen") && (
        <Button variante="blanco" tamano="sm" className="mt-5 w-full" onClick={() => setAbierto(true)}>
          Cambiar origen
        </Button>
      )}

      <Modal abierto={abierto} titulo="Cambiar el origen" onCerrar={cerrar}>
        <form onSubmit={enviar} className="flex flex-col gap-4">
          <p className="text-ink-2">El cambio queda registrado con su nombre, la fecha y el motivo.</p>
          <FormField etiqueta="Nuevo origen" htmlFor="nuevo-origen" obligatorio>
            <Select
              id="nuevo-origen"
              required
              vacio="Elija una fuente"
              value={fuenteId}
              onChange={(e) => setFuenteId(e.target.value)}
              opciones={fuentes.filter((f) => f.id !== matricula.fuenteId).map((f) => ({ valor: f.id, etiqueta: `${f.nombre} (${TIPOS[f.tipo]})` }))}
            />
          </FormField>
          <FormField etiqueta="Motivo" htmlFor="motivo-origen" obligatorio ayuda="Por ejemplo: la promotora acompañó al apoderado, pero él entró por el enlace general.">
            <Textarea id="motivo-origen" required value={motivo} onChange={(e) => setMotivo(e.target.value)} aria-describedby="motivo-origen-msg" />
          </FormField>
          {cambiar.isError && <p className="text-sm font-semibold text-danger">{cambiar.error.message}</p>}
          <div className="flex flex-wrap justify-end gap-3">
            <Button variante="blanco" onClick={cerrar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!fuenteId || !motivo.trim() || cambiar.isPending}>
              {cambiar.isPending ? "Guardando…" : "Cambiar origen"}
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
