import { useEffect, useState } from "react";

export const useWaitForCookiesReady = (
  names: string[],
  maxWaitMs = 3000,
  checkInterval = 100
): boolean | undefined => {
  const [ready, setReady] = useState<boolean | undefined>(undefined);

  const joinedNames = names.join("|"); // ✅ expresión separada

  useEffect(() => {
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
  }, [joinedNames, names, maxWaitMs, checkInterval]); // ✅ sin warning

  return ready;
};
