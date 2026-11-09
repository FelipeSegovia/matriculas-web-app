import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Textarea } from "@/components/atoms/Textarea";
import { FormField } from "@/components/molecules/FormField";
import { OpcionesChips } from "@/components/molecules/OpcionesChips";

type Tipo = "texto" | "area" | "fecha" | "rut" | "telefono" | "correo" | "numero" | "seleccion";

const INPUT: Partial<Record<Tipo, { type: string; inputMode?: "numeric" | "tel" | "email" }>> = {
  fecha: { type: "date" },
  telefono: { type: "tel", inputMode: "tel" },
  correo: { type: "email", inputMode: "email" },
  numero: { type: "text", inputMode: "numeric" },
};

type Props = {
  id: string;
  tipo: Tipo;
  etiqueta: string;
  valor: string;
  onCambiar: (valor: string) => void;
  opciones?: string[];
  ayuda?: string;
  placeholder?: string;
  error?: string;
  obligatorio?: boolean;
  deshabilitado?: boolean;
  autoComplete?: string;
};

/** Un campo de formulario según su tipo. Hasta 8 opciones se muestran como botones; más, como lista. */
export function CampoFicha({ id, tipo, etiqueta, valor, onCambiar, opciones = [], ayuda, placeholder, error, obligatorio, deshabilitado, autoComplete }: Props) {
  if (tipo === "seleccion" && opciones.length <= 8)
    return (
      <OpcionesChips
        nombre={id}
        leyenda={etiqueta}
        opciones={opciones}
        valor={valor}
        onCambiar={onCambiar}
        ayuda={ayuda}
        error={error}
        obligatorio={obligatorio}
        deshabilitado={deshabilitado}
      />
    );

  const comunes = {
    id,
    value: valor,
    disabled: deshabilitado,
    placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error || ayuda ? `${id}-msg` : undefined,
  };

  return (
    <FormField etiqueta={etiqueta} htmlFor={id} error={error} ayuda={ayuda} obligatorio={obligatorio}>
      {tipo === "seleccion" ? (
        <Select {...comunes} vacio="Elegir" opciones={opciones.map((o) => ({ valor: o, etiqueta: o }))} onChange={(e) => onCambiar(e.target.value)} />
      ) : tipo === "area" ? (
        <Textarea {...comunes} onChange={(e) => onCambiar(e.target.value)} />
      ) : (
        <Input {...comunes} type={INPUT[tipo]?.type ?? "text"} inputMode={INPUT[tipo]?.inputMode} autoComplete={autoComplete ?? "off"} onChange={(e) => onCambiar(e.target.value)} />
      )}
    </FormField>
  );
}
