import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Usuario } from "@/lib/matricula";

type Sesion = {
  token: string | null;
  usuario: Usuario | null;
  iniciar: (token: string, usuario: Usuario) => void;
  cerrar: () => void;
};

// shortcut: sesión simulada en sessionStorage contra MSW; cambiar a JWT en cookie httpOnly + TOTP (D08) cuando exista el backend.
export const useSesionStore = create<Sesion>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      iniciar: (token, usuario) => set({ token, usuario }),
      cerrar: () => set({ token: null, usuario: null }),
    }),
    { name: "sesion-panel", storage: createJSONStorage(() => sessionStorage) },
  ),
);
