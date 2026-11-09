type Props = {
  nombre: string;
  leyenda: string;
  opciones: string[];
  valor: string;
  onCambiar: (valor: string) => void;
  ayuda?: string;
  error?: string;
  obligatorio?: boolean;
  deshabilitado?: boolean;
};

/** Grupo de radios con forma de botones: elegir con un toque en el celular. Tocar la opción elegida la desmarca. */
export function OpcionesChips({ nombre, leyenda, opciones, valor, onCambiar, ayuda, error, obligatorio, deshabilitado }: Props) {
  const mensaje = error ?? ayuda;
  return (
    <fieldset id={nombre} tabIndex={-1} aria-describedby={mensaje ? `${nombre}-msg` : undefined} className="flex flex-col gap-2 focus:outline-none" disabled={deshabilitado}>
      <legend className="mb-2 text-sm font-bold text-ink-2">
        {leyenda}
        {obligatorio && (
          <span className="text-school" aria-hidden="true">
            {" "}*
          </span>
        )}
      </legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => (
          <label
            key={o}
            className={
              "bubble-bl relative cursor-pointer bg-field px-4 py-2.5 font-semibold text-ink ring-2 ring-line transition-colors " +
              "hover:ring-school/40 has-checked:bg-school has-checked:text-white has-checked:ring-school " +
              "has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-school has-disabled:cursor-not-allowed has-disabled:opacity-50 " +
              (error ? "ring-danger/60" : "")
            }
          >
            <input
              type="radio"
              name={nombre}
              value={o}
              checked={valor === o}
              onChange={() => onCambiar(o)}
              onClick={() => valor === o && onCambiar("")}
              className="sr-only"
            />
            {o}
          </label>
        ))}
      </div>
      {mensaje && (
        <p id={`${nombre}-msg`} className={`text-sm ${error ? "font-semibold text-danger" : "text-muted"}`}>
          {mensaje}
        </p>
      )}
    </fieldset>
  );
}
