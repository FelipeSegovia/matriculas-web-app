import type { Metadata } from "next";
import { LoginForm } from "@/components/organisms/LoginForm";
import { LoginTemplate } from "@/components/templates/LoginTemplate";

export const instant = false;

export const metadata: Metadata = { title: "Ingresar" };

export default function LoginPage() {
  return (
    <LoginTemplate titulo="Cada ficha, a un clic de la firma." bajada="Revise, complete e imprima las matrículas que llegan por QR, y sepa de dónde vino cada una.">
      <h2 className="mb-1 text-3xl">Ingresar al panel</h2>
      <p className="mb-7 text-muted">Para Dirección, UTP y Secretaría.</p>
      <LoginForm />
      {process.env.NODE_ENV === "development" && (
        <p className="mt-6 rounded-2xl bg-ground px-4 py-3 text-sm text-ink-2">
          <span className="font-bold">Ejemplo ilustrativo:</span> direccion@ejemplo.cl, utp@ejemplo.cl o secretaria@ejemplo.cl, con la contraseña{" "}
          <code className="font-bold">demo1234</code>.
        </p>
      )}
    </LoginTemplate>
  );
}
