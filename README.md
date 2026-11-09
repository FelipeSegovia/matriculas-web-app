This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Panel de administración con datos mock (MSW)

En desarrollo (`pnpm dev`), MSW simula la API y el panel queda en [http://localhost:3000/admin](http://localhost:3000/admin). Usuarios de prueba (ficticios, definidos en `mocks/data/index.ts`):

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Dirección | `direccion@ejemplo.cl` | `demo1234` |
| UTP | `utp@ejemplo.cl` | `demo1234` |
| Secretaría | `secretaria@ejemplo.cl` | `demo1234` |

Formulario de inscripción del apoderado (sin login), para la escuela de ejemplo:

- Inscripción nueva con el QR de una promotora: [http://localhost:3000/ejemplo/inscripcion?ref=PROM-CR](http://localhost:3000/ejemplo/inscripcion?ref=PROM-CR). Otros códigos: `PROM-DM`, `EDU-PH` y `FLY-V27`. Sin `ref`, se pregunta "¿Cómo supo de nosotros?".
- Retomar una ficha existente: `http://localhost:3000/ejemplo/ficha/demo-m001`. Funcionan de `demo-m001` a `demo-m010`, que están en «Pre-inscrita» o «Ficha completa». Desde `demo-m011` en adelante, el enlace aparece desactivado.

Los cambios se guardan en `localStorage` (clave `mock-matriculas`), compartido entre el panel y el formulario; bórrela para volver a los datos de ejemplo. Estas credenciales y enlaces solo funcionan contra MSW, no contra el backend real.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
