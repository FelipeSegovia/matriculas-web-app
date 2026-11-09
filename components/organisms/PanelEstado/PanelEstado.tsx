"use client";

import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Modal } from "@/components/molecules/Modal";
import { useCambiarEstado } from "@/hooks/useEditarMatricula";
import { TONO_ESTADO } from "@/lib/estadoUi";
import { ETIQUETAS_ESTADO, TRANSICIONES, type Estado, type Matricula, type Rol } from "@/lib/matricula";
import { transicionesPermitidas } from "@/lib/permisos";

const CAMINO: Estado[] = ["PreInscrita", "FichaCompleta", "EvaluacionAgendada", "Evaluada", "ListaParaFirmar", "Matriculada"];

const AVISOS: Partial<Record<Estado, string>> = {
  EvaluacionAgendada: "El enlace para retomar del apoderado se desactivará. Desde ahí, solo la escuela edita la ficha.",
  ListaParaFirmar: "Se asignará el siguiente N° de matrícula del año.",
  Matriculada: "Confirme que el apoderado ya firmó la ficha en papel. Desde ahora cuenta para la comisión del origen.",
  Descartada: "La ficha queda fuera del proceso y ya no podrá avanzar.",
};

export function PanelEstado({ matricula, rol }: { matricula: Matricula; rol: Rol }) {
  const cambiar = useCambiarEstado(matricula.id);
  const [destino, setDestino] = useState<Estado | null>(null);
  const siguientes = transicionesPermitidas(rol, matricula.estado);
  const lateral = !CAMINO.includes(matricula.estado);
  const paso = CAMINO.indexOf(matricula.estado);

  function cerrar() {
    setDestino(null);
    cambiar.reset();
  }

  function confirmar() {
    if (!destino) return;
    cambiar.mutate(destino, { onSuccess: () => setDestino(null) });
  }

  return (
    <section aria-labelledby="tit-estado" className="rounded-(--radius-card) bg-white p-5 shadow-(--shadow-soft) sm:p-6">
      <h2 id="tit-estado" className="mb-4 text-lg">
        Estado
      </h2>
      <Badge tono={TONO_ESTADO[matricula.estado]}>{ETIQUETAS_ESTADO[matricula.estado]}</Badge>

      <ol className="mt-5 flex flex-col gap-2" aria-label="Ciclo de vida de la matrícula">
        {CAMINO.map((e, i) => {
          const hecho = !lateral && i < paso;
          const actual = e === matricula.estado;
          return (
            <li key={e} className={`flex items-center gap-3 text-sm ${actual ? "font-extrabold text-ink" : hecho ? "font-semibold text-ink-2" : "text-muted"}`} aria-current={actual ? "step" : undefined}>
              <span
                aria-hidden="true"
                className={`grid size-6 shrink-0 place-items-center rounded-[12px_12px_12px_3px] text-xs font-bold ${
                  actual ? "bg-school text-white" : hecho ? "bg-mint text-ink" : "bg-ground text-muted ring-1 ring-line"
                }`}
              >
                {hecho ? "✓" : i + 1}
              </span>
              {ETIQUETAS_ESTADO[e]}
            </li>
          );
        })}
      </ol>

      {siguientes.length > 0 ? (
        <div className="mt-6 flex flex-col gap-2">
          <p className="text-sm font-bold text-ink-2">Mover a</p>
          {siguientes.map((e) => (
            <Button key={e} variante={e === "Descartada" ? "peligro" : e === "Matriculada" ? "tinta" : "color"} onClick={() => setDestino(e)}>
              {ETIQUETAS_ESTADO[e]}
            </Button>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">
          {TRANSICIONES[matricula.estado].length === 0 ? "Este estado es final." : "Con su rol no puede cambiar este estado."}
        </p>
      )}

      <Modal abierto={destino !== null} titulo={destino ? `¿Pasar a «${ETIQUETAS_ESTADO[destino]}»?` : ""} onCerrar={cerrar}>
        {destino && AVISOS[destino] && <p className="text-ink-2">{AVISOS[destino]}</p>}
        {cambiar.isError && <p className="text-sm font-semibold text-danger">{cambiar.error.message}</p>}
        <div className="flex flex-wrap justify-end gap-3">
          <Button variante="blanco" onClick={cerrar}>
            Cancelar
          </Button>
          <Button variante={destino === "Descartada" ? "peligro" : "color"} onClick={confirmar} disabled={cambiar.isPending}>
            {cambiar.isPending ? "Guardando…" : "Confirmar"}
          </Button>
        </div>
      </Modal>
    </section>
  );
}
