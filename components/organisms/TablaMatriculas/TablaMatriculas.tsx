import Link from "next/link";
import { Badge } from "@/components/atoms/Badge";
import { TONO_ESTADO, formatearFecha } from "@/lib/estadoUi";
import { ETIQUETAS_ESTADO, type Fuente, type MatriculaResumen } from "@/lib/matricula";

type Props = { items: MatriculaResumen[]; fuentes: Fuente[] };

export function TablaMatriculas({ items, fuentes }: Props) {
  const nombreFuente = (id: string) => fuentes.find((f) => f.id === id)?.nombre ?? "—";

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left">
        <thead>
          <tr className="text-xs font-extrabold tracking-wide text-muted uppercase">
            {["Alumno", "RUT", "Nivel", "Origen", "Estado", "Recibida", "N° matrícula"].map((h) => (
              <th key={h} scope="col" className="border-b-2 border-line px-4 py-3 first:pl-6 last:pr-6">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((m) => (
            <tr key={m.id} className="group transition-colors hover:bg-school-soft/60">
              <td className="border-b border-line/70 px-4 py-3.5 pl-6">
                <Link
                  href={`/admin/matriculas/${m.id}`}
                  className="flex items-center gap-2.5 font-bold text-ink no-underline group-hover:text-school-deep hover:underline"
                >
                  {!m.vista && (
                    <span className="size-2.5 shrink-0 rounded-[5px_5px_5px_1px] bg-sun ring-2 ring-sun/30" aria-label="Nueva, sin abrir" role="img" />
                  )}
                  {m.alumno}
                </Link>
              </td>
              <td className="border-b border-line/70 px-4 py-3.5 whitespace-nowrap text-ink-2">{m.rut}</td>
              <td className="border-b border-line/70 px-4 py-3.5 text-ink-2">
                <span className="whitespace-nowrap">{m.nivel}</span>
                <span className="block text-xs text-muted">{m.jornada}</span>
              </td>
              <td className="border-b border-line/70 px-4 py-3.5 text-ink-2">{nombreFuente(m.fuenteId)}</td>
              <td className="border-b border-line/70 px-4 py-3.5">
                <Badge tono={TONO_ESTADO[m.estado]}>{ETIQUETAS_ESTADO[m.estado]}</Badge>
              </td>
              <td className="border-b border-line/70 px-4 py-3.5 whitespace-nowrap text-ink-2">{formatearFecha(m.creadaEn, true)}</td>
              <td className="border-b border-line/70 px-4 py-3.5 pr-6 font-display font-semibold whitespace-nowrap">
                {m.numero ?? <span className="font-body font-normal text-muted">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
