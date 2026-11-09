import type { ReactNode } from "react";

export function AdminTemplate({ header, children }: { header: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      {header}
      <main id="contenido" className="wrap flex-1 py-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}
