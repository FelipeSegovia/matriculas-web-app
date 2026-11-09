import { useSesionStore } from "@/stores/useSesionStore";

/** fetch a la API con la sesión actual. Lanza un Error con el mensaje del servidor si la respuesta no es OK. */
export async function api<T>(ruta: string, init: RequestInit = {}): Promise<T> {
  const { token, cerrar } = useSesionStore.getState();
  const res = await fetch(`/api${ruta}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (res.status === 401 && token) cerrar();
  if (!res.ok) {
    const cuerpo = await res.json().catch(() => null);
    throw new Error(cuerpo?.mensaje ?? "No se pudo conectar con el servidor.");
  }
  return res.json();
}
