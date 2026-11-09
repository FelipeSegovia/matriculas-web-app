// Sustituto de mocks/browser.ts en el servidor, donde msw/browser no existe (ver next.config.ts).
export const worker = {
  start: async () => undefined,
};
