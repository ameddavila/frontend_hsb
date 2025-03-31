"use client";

import { useEffect, useState } from "react";

/**
 * Hook para detectar cuándo la sesión está completamente lista.
 * Retorna un booleano (`true` cuando el usuario fue autenticado via login o refresh).
 * También acepta un callback opcional que se ejecutará una sola vez.
 *
 * @param onReady Optional callback que se dispara una vez cuando la sesión esté lista.
 */
export function useSessionReady(onReady?: () => void) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handleReady = () => {
      if (!ready) {
        console.log("✅ Sesión restaurada (useSessionReady)");
        setReady(true);
        if (onReady) onReady();
      }
    };

    window.addEventListener("session-ready", handleReady);
    return () => window.removeEventListener("session-ready", handleReady);
  }, [ready, onReady]);

  return ready;
}
