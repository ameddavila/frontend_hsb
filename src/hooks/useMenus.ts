// src/hooks/useMenus.ts
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "./useAuth";
import { useSessionReady } from "./useSessionReady";
import { useMenuStore } from "@/stores/menuStore";

export const useMenus = () => {
  const { user } = useAuth();
  const sessionReady = useSessionReady();

  const menus = useMenuStore((state) => state.menus);
  const setMenus = useMenuStore((state) => state.setMenus);
  const clearMenus = useMenuStore((state) => state.clearMenus);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🧠 Escuchar la hidratación de Zustand
  useEffect(() => {
    const unsub = useMenuStore.persist.onFinishHydration(() => {
      console.log("💾 Zustand (menuStore) hidratado");
      setHydrated(true);
      // ⚡ Si ya hay menús en memoria, evitar loading innecesario
      if (useMenuStore.getState().menus.length > 0) {
        console.log("✅ Menús ya disponibles desde persistencia");
        setLoading(false);
      }
    });

    return () => unsub?.();
  }, []);

  const fetchMenus = async (context = "default") => {
    try {
      setLoading(true);
      console.log(`📡 Cargando menús... (${context})`);
      const res = await api.get("/menus/my-menus");
      console.log("📥 Menús recibidos:", res.data);
      setMenus(res.data);
    } catch (err) {
      console.error("❌ Error al obtener menús:", err);
      clearMenus();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hydrated || !user || !sessionReady) return;

    if (menus.length === 0) {
      console.log("📦 useMenus: menús vacíos, realizando fetch");
      fetchMenus("post-hydration");
    }
  }, [hydrated, user, sessionReady]);

  return { menus, loading };
};
