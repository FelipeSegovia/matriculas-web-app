const FONDOS = {
  sol: "bg-sun text-ink",
  color: "bg-school text-white",
  menta: "bg-mint text-ink",
  blanco: "bg-white text-ink",
};

type Props = { valor: number | string; etiqueta: string; tono?: keyof typeof FONDOS; forma?: "bl" | "br" };

export function StatCard({ valor, etiqueta, tono = "blanco", forma = "bl" }: Props) {
  return (
    <div className={`${forma === "bl" ? "bubble-bl" : "bubble-br"} flex flex-col gap-1 px-5 py-4 shadow-(--shadow-soft) ${FONDOS[tono]}`}>
      <span className="font-display text-4xl font-semibold leading-none tabular-nums">{valor}</span>
      <span className="text-sm font-bold opacity-85">{etiqueta}</span>
    </div>
  );
}
