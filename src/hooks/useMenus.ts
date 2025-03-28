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

  // ✅ Esperar hidratación de Zustand
  useEffect(() => {
    const unsub = useMenuStore.persist.onFinishHydration(() => {
      console.log("💾 Zustand hidratado (menuStore)");
      setHydrated(true);
      // Si ya hay menús, no necesitamos cargar
      if (useMenuStore.getState().menus.length > 0) {
        console.log("✅ Menús existentes en localStorage");
        setLoading(false);
      }
    });

    return () => unsub?.();
  }, []);

  const fetchMenus = async (context = "default") => {
    try {
      setLoading(true);
      console.log(`📡 Obteniendo menús desde el backend (${context})`);
      const res = await api.get("/menus/my-menus");
      setMenus(res.data);
      setMenuLoaded(true);
      console.log("📥 Menús recibidos y almacenados");
    } catch (err) {
      console.error("❌ Error al obtener menús:", err);
      clearMenus();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cargar menús una vez cuando hay sesión lista y no están cargados
  useEffect(() => {
    if (!hydrated || !sessionReady || !user) return;

    const persistedMenus = useMenuStore.getState().menus;
    const loadedFlag = useMenuStore.getState().menuLoaded;

    if (persistedMenus.length === 0 || !loadedFlag) {
      console.log("🔄 Menús no presentes o no marcados como cargados, obteniendo...");
      fetchMenus("session-ready");
    } else {
      console.log("✅ Menús ya estaban persistidos, sin fetch");
      setLoading(false);
    }
  }, [hydrated, sessionReady, user]);

  return { menus, loading };
};
