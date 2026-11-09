import type { Usuario } from "@/lib/matricula";
import { api } from "./api";

export function login(correo: string, clave: string) {
  return api<{ token: string; usuario: Usuario }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo, clave }),
  });
}
