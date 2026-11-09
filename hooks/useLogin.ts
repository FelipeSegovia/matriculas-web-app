import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth";
import { useSesionStore } from "@/stores/useSesionStore";

export function useLogin() {
  const iniciar = useSesionStore((s) => s.iniciar);
  return useMutation({
    mutationFn: ({ correo, clave }: { correo: string; clave: string }) => login(correo, clave),
    onSuccess: ({ token, usuario }) => iniciar(token, usuario),
  });
}
