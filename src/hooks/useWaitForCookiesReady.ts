import { useEffect, useState } from "react";

/**
 * Hook personalizado para esperar que ciertas cookies estén disponibles.
 *
 * @param names Lista de nombres de cookies que se deben esperar.
 * @param maxWaitMs Tiempo máximo de espera (por defecto: 3000ms).
 * @param checkInterval Intervalo de verificación en milisegundos (por defecto: 100ms).
 * @returns `true` si las cookies están disponibles, `false` si no aparecen a tiempo, `undefined` si aún está esperando.
 */
export const useWaitForCookiesReady = (
  names: string[],
  maxWaitMs = 3000,
  checkInterval = 100
): boolean | undefined => {
  const [ready, setReady] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let waited = 0;
    let intervalId: NodeJS.Timeout;

    const checkCookies = () => {
      const allPresent = names.every((name) =>
        document.cookie.includes(`${name}=`)
      );

      if (allPresent) {
        console.log("🍪 Todas las cookies listas:", names);
        clearInterval(intervalId);
        setReady(true);
      } else if (waited >= maxWaitMs) {
        const faltantes = names.filter((name) => !document.cookie.includes(`${name}=`));
        console.warn("⚠️ Tiempo agotado. Faltan cookies:", faltantes);
        clearInterval(intervalId);
        setReady(false);
      } else {
        waited += checkInterval;
      }
    };

    intervalId = setInterval(checkCookies, checkInterval);

    return () => clearInterval(intervalId); // Limpiar al desmontar
  }, [names.join(","), maxWaitMs]);

  return ready;
};
