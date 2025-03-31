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
  const menuLoaded = useMenuStore((state) => state.menuLoaded);

  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔄 Detecta hidratación del localStorage de Zustand
  useEffect(() => {
    const unsub = useMenuStore.persist.onFinishHydration(() => {
      console.log("💾 Zustand hidratado (menuStore)");
      setHydrated(true);
    });

    // También activamos si ya venía hidratado
    if (typeof window !== "undefined") {
      const persisted = useMenuStore.persist.getOptions().storage?.getItem("menu-storage");
      if (persisted) setHydrated(true);
    }

    return () => unsub?.();
  }, []);

  // 📡 Función para cargar los menús desde el backend
  const fetchMenus = useCallback(async (context = "default") => {
    try {
      setLoading(true);
      console.log(`📡 [useMenus] Obteniendo menús desde backend (${context})...`);
      const response = await api.get("/menus/my-menus");

      setMenus(response.data);
      setMenuLoaded(true);
      console.log("✅ [useMenus] Menús recibidos y almacenados:", response.data);
    } catch (error) {
      console.error("❌ [useMenus] Error al obtener menús:", error);
      clearMenus();
      setMenuLoaded(false);
    } finally {
      setLoading(false);
    }
  }, [setMenus, clearMenus, setMenuLoaded]);

  // 🧠 Lógica para decidir si cargar los menús
  useEffect(() => {
    const shouldLoad = hydrated && sessionReady && user && (!menus.length || !menuLoaded);

    console.groupCollapsed("🧪 useMenus Diagnóstico");
    console.log("hydrated:", hydrated);
    console.log("sessionReady:", sessionReady);
    console.log("user:", user);
    console.log("menus.length:", menus.length);
    console.log("menuLoaded:", menuLoaded);
    console.log("shouldLoad:", shouldLoad);
    console.groupEnd();

    if (shouldLoad) {
      fetchMenus("session-ready");
    } else {
      setLoading(false);
    }
  }, [hydrated, sessionReady, user, menuLoaded, menus.length, fetchMenus]);

  return {
    menus,
    loading,
    fetchMenus,
  };
};
