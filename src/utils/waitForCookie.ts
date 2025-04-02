// src/utils/waitForCookie.ts

/**
 * Determina si una cookie es HttpOnly y no puede ser leída por JavaScript.
 */
const isHttpOnly = (name: string) =>
  ["refreshToken", "accessToken"].includes(name);

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
  if (isHttpOnly(name)) {
    console.warn(`🚫 La cookie "${name}" es HttpOnly y no se puede leer desde JavaScript.`);
    return null;
  }

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
  const visibleNames = names.filter((n) => !isHttpOnly(n));
  const missing: string[] = [];

  for (const name of visibleNames) {
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

/**
 * Espera hasta que el csrfToken deje de contener "publico"
 * @param maxWaitMs Tiempo máximo de espera en milisegundos
 * @param interval Intervalo entre reintentos
 * @returns true si el CSRF fue rotado correctamente
 */
export const waitForRotatedCsrf = async (
  maxWaitMs = 3000,
  interval = 100
): Promise<boolean> => {
  const start = Date.now();

  while (Date.now() - start < maxWaitMs) {
    const match = document.cookie.match(/(^| )csrfToken=([^;]+)/);
    if (match && !match[2].includes("publico")) {
      console.log("🛡️ CSRF token rotado detectado:", match[2]);
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  console.warn("⏳ CSRF token aún no rotado (sigue siendo 'publico')");
  return false;
};
