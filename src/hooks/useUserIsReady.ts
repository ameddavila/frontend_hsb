// src/hooks/useUserIsReady.ts
"use client";

import { useUserStore } from "@/stores/useUserStore";
import { useSessionReady } from "@/hooks/useSessionReady";
import { useEffect, useState } from "react";

/**
 * Hook combinado que indica si el usuario está listo para usarse
 * y devuelve también el user desde Zustand.
 */
export function useUserIsReady() {
  const { user } = useUserStore();
  const sessionReady = useSessionReady();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const ready = hydrated && sessionReady && !!user;

  return {
    user,
    ready,
    hydrated,
    sessionReady,
  };
}
