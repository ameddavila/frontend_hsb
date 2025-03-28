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
  const menuLoaded = useMenuStore((state) => state.menuLoaded);
  const setMenuLoaded = useMenuStore((state) => state.setMenuLoaded);

  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🧠 Escuchar hidratación de Zustand
  useEffect(() => {
    const unsub = useMenuStore.persist.onFinishHydration(() => {
      console.log("💾 Zustand (menuStore) hidratado");
      setHydrated(true);

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
      setMenuLoaded(true);
    } catch (err) {
      console.error("❌ Error al obtener menús:", err);
      clearMenus();
      setMenuLoaded(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Solo cargar si:
  // - Zustand está hidratado
  // - Hay usuario y sesión
  // - No hay menús aún
  useEffect(() => {
    if (!hydrated) return;

    if (menus.length > 0) {
      console.log("✅ useMenus: ya hay menús, sin fetch");
      setLoading(false);
      return;
    }

    if (user && sessionReady && !menuLoaded) {
      console.log("📦 useMenus: menús no cargados, haciendo fetch");
      fetchMenus("sessionReady");
    }
  }, [hydrated, user, sessionReady, menuLoaded]);

  return { menus, loading };
};
