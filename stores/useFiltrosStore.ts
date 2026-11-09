import { create } from "zustand";

export type Filtros = { fuente: string; estado: string; nivel: string; desde: string; hasta: string };

export const FILTROS_VACIOS: Filtros = { fuente: "", estado: "", nivel: "", desde: "", hasta: "" };

type FiltrosStore = {
  filtros: Filtros;
  cambiar: (clave: keyof Filtros, valor: string) => void;
  limpiar: () => void;
};

// Fuera de la página para que los filtros sigan ahí al volver desde una ficha.
export const useFiltrosStore = create<FiltrosStore>()((set) => ({
  filtros: FILTROS_VACIOS,
  cambiar: (clave, valor) => set((s) => ({ filtros: { ...s.filtros, [clave]: valor } })),
  limpiar: () => set({ filtros: FILTROS_VACIOS }),
}));
