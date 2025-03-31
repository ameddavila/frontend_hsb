"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/useUserStore";

/**
 * Hook para detectar cuándo la sesión está completamente lista.
 * Retorna `true` si:
 *  - ya hay un usuario cargado en userStore, O
 *  - se disparó el evento "session-ready".
 */
export function useSessionReady() {
  const [ready, setReady] = useState(false);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    // Si ya tenemos user en la store y `ready` aún es false, lo activamos
    if (!ready && user) {
      console.log("🟢 useSessionReady => ya hay un user => setReady(true)");
      setReady(true);
    }
  }, [user, ready]);

  useEffect(() => {
    const handleReady = () => {
      if (!ready) {
        console.log("✅ Evento 'session-ready' capturado => setReady(true)");
        setReady(true);
      }
    };

    window.addEventListener("session-ready", handleReady);
    return () => window.removeEventListener("session-ready", handleReady);
  }, [ready]);

  return ready;
}
