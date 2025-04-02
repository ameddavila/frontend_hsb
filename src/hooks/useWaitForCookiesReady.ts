import { useEffect, useState } from "react";

const HTTP_ONLY_COOKIES = ["accessToken", "refreshToken"];

/**
 * Espera cookies visibles (no HttpOnly). Ignora accessToken y refreshToken.
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

    // Solo esperamos cookies que NO sean HttpOnly
    const visibleCookies = names.filter(
      (name) => !HTTP_ONLY_COOKIES.includes(name)
    );

    if (visibleCookies.length === 0) {
      console.log("👻 Todas las cookies son HttpOnly, no hay nada que esperar.");
      setReady(true);
      return;
    }

    let waited = 0;
    const intervalId = setInterval(() => {
      const allPresent = names.every((name) => {
        if (name === "refreshToken") {
          return true; // Es HttpOnly, no se puede verificar desde el frontend
        }
        return document.cookie.includes(`${name}=`);
      });
      

      if (allPresent) {
        console.log("🍪 Cookies visibles listas:", visibleCookies);
        clearInterval(intervalId);
        setReady(true);
      } else if (waited >= maxWaitMs) {
        const faltantes = visibleCookies.filter(
          (name) => !document.cookie.includes(`${name}=`)
        );
        console.warn("⏳ Tiempo agotado. Faltan cookies visibles:", faltantes);
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
