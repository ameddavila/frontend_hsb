// src/utils/waitForCookie.ts

/**
 * Espera hasta que una cookie específica esté disponible en el navegador.
 * @param name Nombre de la cookie a esperar.
 * @param maxWaitMs Tiempo máximo de espera (ms).
 * @returns El valor de la cookie o null si no aparece a tiempo.
 */
export const waitForCookie = async (
  name: string,
  maxWaitMs = 1000
): Promise<string | null> => {
  const interval = 50;
  let waited = 0;

  while (waited < maxWaitMs) {
    const cookie = document.cookie.match(
      new RegExp(`(^| )${name}=([^;]+)`)
    )?.[2];
    if (cookie) return cookie;

    await new Promise((resolve) => setTimeout(resolve, interval));
    waited += interval;
  }

  console.warn(`⏳ Tiempo agotado esperando cookie: ${name}`);
  return null;
};

/**
 * Espera hasta que todas las cookies especificadas estén disponibles.
 * @param names Lista de nombres de cookies a esperar.
 * @param maxWaitMs Tiempo máximo para esperar cada cookie (ms).
 * @returns true si todas las cookies están disponibles, false si alguna falla.
 */
export const waitForAllCookies = async (
  names: string[],
  maxWaitMs = 2000
): Promise<boolean> => {
  const results = await Promise.all(
    names.map((name) => waitForCookie(name, maxWaitMs))
  );
  return results.every((cookie) => Boolean(cookie));
};
