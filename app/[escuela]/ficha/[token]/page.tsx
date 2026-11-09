"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/molecules/EmptyState";
import { FormularioInscripcion } from "@/components/organisms/FormularioInscripcion";
import { InscripcionTemplate } from "@/components/templates/InscripcionTemplate";
import { useEscuela, useFichaPublica } from "@/hooks/useInscripcion";
import { PASOS } from "@/lib/fichaPublica";

function Ficha() {
  const { escuela: slug, token } = useParams<{ escuela: string; token: string }>();
  const pasoUrl = Number(useSearchParams().get("paso"));
  const escuela = useEscuela(slug);
  const ficha = useFichaPublica(token);
  // ?paso=2 llega desde la confirmación del paso 1; sin él se parte por el paso 2, el primero pendiente.
  const pasoInicial = pasoUrl >= 1 && pasoUrl <= PASOS.length ? pasoUrl - 1 : 1;

  const error = escuela.error ?? ficha.error;
  return (
    <InscripcionTemplate escuela={escuela.data}>
      {error ? (
        <EmptyState titulo="No podemos abrir esta ficha" texto={error.message} />
      ) : !escuela.data || !ficha.data ? (
        <div className="grid place-items-center py-20">
          <Spinner etiqueta="Cargando su ficha" />
        </div>
      ) : (
        <FormularioInscripcion key={token} escuela={escuela.data} modo={{ tipo: "retomar", token, inicial: ficha.data, pasoInicial }} />
      )}
    </InscripcionTemplate>
  );
}

export default function FichaPage() {
  return (
    <Suspense>
      <Ficha />
    </Suspense>
  );
}
