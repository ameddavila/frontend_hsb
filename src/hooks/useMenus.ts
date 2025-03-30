import { useEffect, useState, useCallback } from "react";
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
  const setMenuLoaded = useMenuStore((state) => state.setMenuLoaded);

  const [hydrated, setHydrated] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!useMenuStore.persist.getOptions().storage?.getItem("menu-storage");
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = useMenuStore.persist.onFinishHydration(() => {
      console.log("💾 Zustand hidratado (menuStore)");
      setHydrated(true);
    });
    return () => unsub?.();
  }, []);

  const fetchMenus = useCallback(async (context = "default") => {
    try {
      setLoading(true);
      console.log(`📡 Obteniendo menús desde el backend (${context})`);
      const res = await api.get("/menus/my-menus");
      setMenus(res.data); // ✅ YA VIENEN CON CHILDREN
      setMenuLoaded(true);
      console.log("📥 Menús recibidos y almacenados:", res.data);
    } catch (err) {
      console.error("❌ Error al obtener menús:", err);
      clearMenus();
    } finally {
      setLoading(false);
    }
  }, [setMenus, clearMenus, setMenuLoaded]);

  useEffect(() => {
    console.log("🧠 useMenus: Comprobando si se deben cargar los menús...");
    console.log("✅ hydrated:", hydrated);
    console.log("✅ sessionReady:", sessionReady);
    console.log("✅ user:", user);

    if (hydrated && sessionReady && user) {
      const persistedMenus = useMenuStore.getState().menus;
      const loadedFlag = useMenuStore.getState().menuLoaded;

      if (persistedMenus.length === 0 || !loadedFlag) {
        console.log("🔄 Menús no presentes o no cargados, obteniendo...");
        fetchMenus("session-ready");
      } else {
        console.log("✅ Menús ya estaban persistidos, sin fetch");
        setLoading(false);
      }
    }
  }, [hydrated, sessionReady, user, fetchMenus]);

  return { menus, loading, fetchMenus };
};
