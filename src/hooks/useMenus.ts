import { useEffect, useState, useCallback } from "react";
import api from "@/services/api";
import { useAuth } from "./useAuth";
import { useSessionReady } from "./useSessionReady";
import { useMenuStore } from "@/stores/menuStore";
import { Menu } from "@/types/Menu";
import { transformMenus } from "@/utils/transformMenus";
import { waitForRotatedCsrf } from "@/utils/waitForCookie"; // ✅ Espera CSRF seguro

export const useMenus = () => {
  const { user } = useAuth();
  const sessionReady = useSessionReady();

  const {
    menus,
    setMenus,
    clearMenus,
    setMenuLoaded,
    menuLoaded,
  } = useMenuStore();

  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 💾 Detecta cuándo Zustand ha sido hidratado desde localStorage
  useEffect(() => {
    const unsub = useMenuStore.persist.onFinishHydration(() => {
      console.log("💾 Zustand hidratado (menuStore)");
      setHydrated(true);
    });

    // Fallback por si ya está hidratado
    if (typeof window !== "undefined") {
      const persisted = useMenuStore.persist.getOptions().storage?.getItem("menu-storage");
      if (persisted) setHydrated(true);
    }

    return () => unsub?.();
  }, []);

  /**
   * 📡 Carga los menús del backend y los transforma a árbol jerárquico
   */
  const fetchMenus = useCallback(async (context = "default") => {
    try {
      setLoading(true);
      console.log(`📡 [useMenus] Obteniendo menús desde backend (${context})...`);

      const csrfOk = await waitForRotatedCsrf();
      if (!csrfOk) {
        console.error("⛔ No se rotó el CSRF. Abortando fetch de menús.");
        return;
      }

      const response = await api.get<Menu[]>("/menus/my-menus");
      const menuTree = transformMenus(response.data);

      setMenus(menuTree);
      setMenuLoaded(true);
      console.log("✅ [useMenus] Menús recibidos y almacenados:", menuTree);
    } catch (error) {
      console.error("❌ [useMenus] Error al obtener menús:", error);
      clearMenus();
      setMenuLoaded(false);
    } finally {
      setLoading(false);
    }
  }, [setMenus, clearMenus, setMenuLoaded]);

  /**
   * 🧠 Decide si se deben cargar los menús después de hidratar Zustand y tener sesión lista
   */
  useEffect(() => {
    const shouldLoad =
      hydrated &&
      sessionReady &&
      user &&
      (!menuLoaded || (menuLoaded && menus.length === 0));

    console.groupCollapsed("🧪 Diagnóstico useMenus");
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
