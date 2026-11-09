import { MARCA_PARTES } from "@/lib/marca";

/** Logotipo del producto. "color" va sobre el color de la escuela; "claro" sobre fondos claros. */
export function Wordmark({ tono = "claro" }: { tono?: "claro" | "color" }) {
  const [a, tu, b] = MARCA_PARTES;
  const sobreColor = tono === "color";
  return (
    <span className={`inline-flex items-center gap-2.5 font-display text-xl font-semibold leading-none tracking-tight ${sobreColor ? "text-white" : "text-ink"}`}>
      <span
        aria-hidden="true"
        className={`grid size-9 place-items-center rounded-[18px_18px_18px_4px] ${sobreColor ? "bg-white text-school" : "bg-school text-white"}`}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5.5 12.5 10 17l8.5-9.5" />
        </svg>
      </span>
      <span>
        {a}
        <span className={sobreColor ? "text-sun" : "text-school"}>{tu}</span>
        {b}
      </span>
    </span>
  );
}
