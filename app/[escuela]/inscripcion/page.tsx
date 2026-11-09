"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/molecules/EmptyState";
import { FormularioInscripcion } from "@/components/organisms/FormularioInscripcion";
import { InscripcionTemplate } from "@/components/templates/InscripcionTemplate";
import { useEscuela } from "@/hooks/useInscripcion";

function Inscripcion() {
  const { escuela: slug } = useParams<{ escuela: string }>();
  // El QR de cada promotora, educadora o campaña trae su código: /escuela/inscripcion?ref=CODIGO (D04).
  const ref = useSearchParams().get("ref") ?? undefined;
  const escuela = useEscuela(slug);

  return (
    <InscripcionTemplate escuela={escuela.data}>
      {escuela.isPending ? (
        <div className="grid place-items-center py-20">
          <Spinner etiqueta="Cargando el formulario" />
        </div>
      ) : escuela.isError ? (
        <EmptyState titulo="No encontramos esta escuela" texto="Revise que el enlace o el código QR estén completos." />
      ) : (
        <FormularioInscripcion escuela={escuela.data} modo={{ tipo: "nueva", ref }} />
      )}
    </InscripcionTemplate>
  );
}

export default function InscripcionPage() {
  return (
    <Suspense>
      <Inscripcion />
    </Suspense>
  );
}
