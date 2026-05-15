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

## Pruebas Unitarias con Vitest

El proyecto incluye una configuracion de pruebas unitarias con **Vitest** + **Testing Library**.

### Comandos disponibles

```bash
npm run test
npm run test:watch
npm run test:coverage
```

- `npm run test`: ejecuta toda la suite una vez.
- `npm run test:watch`: ejecuta Vitest en modo interactivo para desarrollo.
- `npm run test:coverage`: genera reporte de cobertura (`text`, `lcov`, `html`).

### Estructura de pruebas

Las pruebas estan organizadas en `src/tests/` por tipo:

- `components/`
- `services/`
- `store/`
- `types/`
- `validations/`

Ademas, existe un archivo de setup global en `src/tests/setup.ts` para:

- registrar `@testing-library/jest-dom`
- limpiar el DOM tras cada test
- mockear `next/navigation`
- definir `NEXT_PUBLIC_BFF_URL` para pruebas

### Cobertura

La configuracion de cobertura se encuentra en `vitest.config.ts` y considera principalmente:

- `src/services/**`
- `src/store/**`
- `src/hooks/**`
- `src/components/**`
- `src/types/**`

Excluye, entre otros:

- `src/tests/**`
- `src/app/**`

Al ejecutar `npm run test:coverage`, el reporte HTML queda disponible en el directorio `coverage/`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
