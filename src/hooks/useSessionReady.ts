"use client";

import { useEffect, useState } from "react";

/**
 * Hook para detectar cuándo la sesión está completamente lista.
 * Retorna un booleano (`true` cuando el usuario fue autenticado via login o refresh).
 * También acepta un callback opcional que se ejecutará una sola vez.
 *
 * @param onReady Optional callback que se dispara una vez cuando la sesión esté lista.
 */
export const useSessionReady = (onReady?: () => void): boolean => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const markReady = () => {
      if (!ready) {
        console.log("✅ Sesión restaurada (useSessionReady)");
        setReady(true);
        if (onReady) onReady();
      }
    };

    // Escuchar eventos globales emitidos desde AuthContext
    window.addEventListener("session-ready", markReady);
    window.addEventListener("session-restored", markReady);

    return () => {
      window.removeEventListener("session-ready", markReady);
      window.removeEventListener("session-restored", markReady);
    };
  }, [onReady, ready]);

  return ready;
};
