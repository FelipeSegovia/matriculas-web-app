"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { useLogin } from "@/hooks/useLogin";

export function LoginForm() {
  const router = useRouter();
  const login = useLogin();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");

  function enviar(e: FormEvent) {
    e.preventDefault();
    login.mutate({ correo, clave }, { onSuccess: () => router.replace("/admin/matriculas") });
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-5" noValidate>
      <FormField etiqueta="Correo" htmlFor="correo">
        <Input id="correo" type="email" autoComplete="username" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
      </FormField>
      <FormField etiqueta="Contraseña" htmlFor="clave">
        <Input id="clave" type="password" autoComplete="current-password" required value={clave} onChange={(e) => setClave(e.target.value)} />
      </FormField>
      <p aria-live="polite" className="min-h-6 text-sm font-semibold text-danger">
        {login.error?.message}
      </p>
      <Button type="submit" disabled={login.isPending || !correo || !clave}>
        {login.isPending ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
