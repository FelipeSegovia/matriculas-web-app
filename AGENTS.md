<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Reglas de trabajo

- No instalar librerías (ni agregar dependencias a `package.json`) sin consultarlo antes con Felipe y recibir su aprobación.
- Si falta información para decidir o implementar algo, decir "no sé" y preguntar en vez de suponer o inventar.

## Contexto de negocio

La lógica de negocio de la aplicación (qué hace, para quién, reglas y decisiones) está documentada en las notas de Obsidian, fuera del repo:

`/Users/fsegovia/Documents/Obsidian_Notes/Freelance/Proyectos/Matriculas Escolares/`

| Nota | Qué contiene |
|------|--------------|
| `001-Resumen.md` | Resumen del proyecto |
| `002-Contexto.md` | Contexto del problema y de los usuarios |
| `003-Análisis.md` | Análisis funcional |
| `004-Riesgos.md` | Riesgos identificados |
| `005-Decisiones.md` | Decisiones tomadas (D01–D13) |
| `006-Seguimiento.md` | Estado y seguimiento |

- Leer las notas relevantes antes de implementar una funcionalidad con reglas de negocio.
- Son de solo lectura para los agentes: no editarlas.
- Si las notas no responden una duda de negocio, aplicar la regla de "no sé" y preguntar.

## Arquitectura: Atomic Design

Los componentes de UI se organizan con Atomic Design en `components/` (en la raíz, junto a `app/`; se importan con el alias `@/components/...`):

| Nivel | Carpeta | Qué va | Ejemplos |
|-------|---------|--------|----------|
| Átomos | `components/atoms/` | Elementos mínimos e indivisibles, sin lógica de negocio. | `Button`, `Input`, `Label`, `Icon`, `Badge` |
| Moléculas | `components/molecules/` | Combinación simple de átomos con un propósito. | `FormField` (Label + Input + error), `SearchBar` |
| Organismos | `components/organisms/` | Secciones completas y autónomas hechas de moléculas y átomos. | `Header`, `FichaMatriculaForm`, `TablaMatriculas` |
| Plantillas | `components/templates/` | Esqueleto de página: distribuye organismos sin datos reales. | `DashboardTemplate`, `FormularioTemplate` |
| Páginas | `app/**/page.tsx` | Rutas de Next.js: cargan los datos y los pasan a una plantilla. | `app/page.tsx` |

Reglas:

- Un nivel solo importa de niveles inferiores (un átomo nunca importa una molécula). Si un componente necesita algo de su mismo nivel o superior, súbelo de nivel.
- Un componente por carpeta: `components/<nivel>/<Nombre>/<Nombre>.tsx`, más un `index.ts` que lo reexporta.
- Átomos y moléculas son presentacionales: reciben todo por props y no hacen fetch ni conocen el dominio. Los datos y la lógica de negocio viven en organismos o páginas.
- Antes de crear un componente, revisa si ya existe uno en algún nivel y reutilízalo.

## Dominio: `lib/`

- Lógica de negocio pura, sin React: tipos y ciclo de vida (`lib/matricula.ts`), permisos por rol (`lib/permisos.ts`), RUT (`lib/rut.ts`) y la ficha de 9 secciones como datos (`lib/ficha.ts`). La usan la UI y los mocks por igual.
- Las pruebas van en `lib/*.test.ts` y se corren con `pnpm test` (`node --test`, que ejecuta TypeScript directamente). Por eso, dentro de `lib/` los imports entre archivos llevan la extensión `.ts`.

## Panel de administración

- Vive en `app/admin/`. `app/admin/providers.tsx` monta TanStack Query, MSW y el guard de sesión, y el panel se dibuja solo en el navegador; por eso sus segmentos declaran `export const instant = false`.
- Las reglas vienen de las notas de Obsidian: ciclo de vida (D03), origen y comisiones (D04), roles (D05), N° de matrícula (D06) y campos de la ficha (D09, D10).

## Estado global: Zustand

- El estado compartido entre componentes se maneja con `zustand`. Los stores viven en `stores/` (raíz), uno por dominio: `stores/use<Dominio>Store.ts` (p. ej. `useMatriculaStore`).
- Solo organismos, plantillas y páginas leen stores; átomos y moléculas siguen siendo presentacionales y reciben todo por props.
- El estado local de un solo componente queda en `useState`; no todo va a un store.
- Los stores son de cliente: el componente que los use necesita `"use client"`.

## Datos de prueba: MSW

- Los datos mock se sirven con `msw` (dependencia de desarrollo). `public/mockServiceWorker.js` lo genera `msw init` (`msw.workerDirectory` en `package.json`): no editarlo a mano.
- Los handlers y los datos de ejemplo van en `mocks/` (raíz): `mocks/handlers.ts` y `mocks/data/`. Los datos de ejemplo son ficticios: nunca usar el nombre del colegio piloto ni datos reales de apoderados o alumnos.
- El código de la app llama a endpoints reales (`fetch('/api/...')`); MSW los intercepta en desarrollo. Ningún componente importa desde `mocks/`: el único punto de entrada es `app/admin/providers.tsx`, que arranca el worker.
- `msw/browser` no existe en Node, así que `next.config.ts` (`turbopack.resolveAlias`) cambia `@/mocks/browser` por `mocks/sin-worker.ts` en el servidor.
- Los handlers imitan las reglas del backend (permisos por rol, transiciones válidas, N° correlativo) y guardan su estado en `sessionStorage` (clave `mock-matriculas`). Para volver a los datos de ejemplo, borre esa clave.

## Datos del servidor: TanStack Query

- Todo fetch al backend pasa por `@tanstack/react-query` (`useQuery` / `useMutation`). Zustand es solo para estado de cliente: no guardar en un store datos que vienen del servidor.
- Las funciones de fetch van en `services/` (raíz), una por recurso (p. ej. `services/matriculas.ts`), y los hooks que las envuelven en `hooks/` (`useMatriculas`, `useCrearMatricula`). Las query keys se definen junto a cada hook.
- Solo organismos, plantillas y páginas usan estos hooks; átomos y moléculas reciben los datos por props.
