type Props = {
  actual: number;
  titulos: string[];
  /** Si se pasa, cada tramo es un botón para saltar a ese paso. */
  onIr?: (i: number) => void;
};

export function Progreso({ actual, titulos, onIr }: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-sm font-bold text-ink-2" aria-live="polite">
        Paso {actual + 1} de {titulos.length} · <span className="text-school-deep">{titulos[actual]}</span>
      </p>
      <ol className="flex gap-1.5">
        {titulos.map((t, i) => {
          const tono = i < actual ? "bg-school" : i === actual ? "bg-sun" : "bg-line";
          return (
            <li key={t} className="flex-1">
              {onIr ? (
                <button
                  type="button"
                  onClick={() => onIr(i)}
                  aria-label={`Ir al paso ${i + 1}: ${t}`}
                  aria-current={i === actual ? "step" : undefined}
                  className={`block h-2.5 w-full rounded-full transition-colors hover:opacity-80 ${tono}`}
                />
              ) : (
                <span className={`block h-2.5 rounded-full ${tono}`} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
