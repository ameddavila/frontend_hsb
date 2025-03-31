// utils/waitForCsrfReady.ts

/**
 * Verifica si el token CSRF aún es público.
 * Se asume que los tokens públicos contienen el ID "publico" codificado.
 */
export const isCsrfTokenPublic = (csrfToken: string): boolean => {
    return csrfToken.includes("publico");
  };
  
  /**
   * Espera a que el token CSRF ya no sea público.
   * @param maxWaitMs Tiempo máximo a esperar.
   * @param interval Tiempo entre chequeos.
   * @returns string | null
   */
  export const waitForValidCsrfToken = async (
    maxWaitMs = 3000,
    interval = 100
  ): Promise<string | null> => {
    const start = Date.now();
  
    while (Date.now() - start < maxWaitMs) {
      const token = getCsrfFromCookie();
      if (token && !isCsrfTokenPublic(token)) {
        console.log("✅ CSRF token válido detectado:", token);
        return token;
      }
  
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  
    console.warn("⏳ Timeout esperando CSRF válido (no público)");
    return null;
  };
  
  /**
   * Extrae el csrfToken de document.cookie
   */
  const getCsrfFromCookie = (): string | null => {
    const match = document.cookie.match(/(^| )csrfToken=([^;]+)/);
    return match?.[2] || null;
  };
  