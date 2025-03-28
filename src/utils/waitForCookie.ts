// src/utils/waitForCookie.ts

/**
 * Espera hasta que una cookie específica esté disponible en el navegador.
 * @param name Nombre de la cookie a esperar.
 * @param maxWaitMs Tiempo máximo de espera en milisegundos.
 * @param interval Intervalo entre reintentos.
 * @returns El valor de la cookie o null si no aparece a tiempo.
 */
export const waitForCookie = async (
  name: string,
  maxWaitMs = 5000,
  interval = 100
): Promise<string | null> => {
  const start = Date.now();

  while (Date.now() - start < maxWaitMs) {
    const match = document.cookie.match(
      new RegExp(`(^| )${name}=([^;]+)`)
    );
    if (match) {
      console.log(`✅ Cookie encontrada: ${name}`);
      return match[2];
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  console.warn(`⏳ Tiempo agotado esperando cookie: ${name}`);
  return null;
};

/**
 * Espera hasta que todas las cookies especificadas estén disponibles.
 * @param names Lista de nombres de cookies a esperar.
 * @param maxWaitMs Tiempo máximo total de espera (compartido entre todas).
 * @returns true si todas están disponibles, false si alguna falla.
 */
export const waitForAllCookies = async (
  names: string[],
  maxWaitMs = 7000
): Promise<boolean> => {
  const start = Date.now();
  const missing: string[] = [];

  for (const name of names) {
    const remainingTime = maxWaitMs - (Date.now() - start);
    if (remainingTime <= 0) {
      console.warn("⛔ Tiempo total agotado antes de terminar todas las cookies.");
      break;
    }

    const found = await waitForCookie(name, remainingTime);
    if (!found) missing.push(name);
  }

  if (missing.length > 0) {
    console.warn("⚠️ Faltan cookies necesarias:", missing);
    return false;
  }

  return true;
};
