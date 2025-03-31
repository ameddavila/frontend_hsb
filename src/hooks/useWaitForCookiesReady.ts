import { useEffect, useState } from "react";

/**
 * Espera a que las cookies indicadas estén disponibles.
 * Evita usar CSRF público después del login.
 */
export const useWaitForCookiesReady = (
  names: string[],
  maxWaitMs = 3000,
  checkInterval = 100
): boolean | undefined => {
  const [ready, setReady] = useState<boolean | undefined>(undefined);
  const joinedNames = names.join("|");

  useEffect(() => {
    const pathname = window.location.pathname;
    const isPublic =
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/recover");

    if (isPublic) {
      console.log("🔓 Ruta pública detectada, no se esperan cookies:", pathname);
      setReady(true);
      return;
    }

    let waited = 0;
    const intervalId = setInterval(() => {
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
    }, checkInterval);

    return () => clearInterval(intervalId);
  }, [joinedNames, names, maxWaitMs, checkInterval]);

  return ready;
};
