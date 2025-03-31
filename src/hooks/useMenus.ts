import { useEffect, useState, useCallback } from "react";
import api from "@/services/api";
import { useAuth } from "./useAuth";
import { useSessionReady } from "./useSessionReady";
import { useMenuStore } from "@/stores/menuStore";
import { Menu } from "@/types/Menu";
import { transformMenus } from "@/utils/transformMenus";
import { waitForRotatedCsrf } from "@/utils/waitForCookie"; // Espera a que el CSRF se "rotara"

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

  // 💾 Detecta cuándo la store de menús ha sido hidratada desde localStorage
  useEffect(() => {
    // 1. Suscribirse al evento onFinishHydration de Zustand
    const unsub = useMenuStore.persist.onFinishHydration(() => {
      console.log("💾 [useMenus] onFinishHydration: menuStore hidratado por persistencia");
      setHydrated(true);
    });

    // 2. Hacemos un fallback manual que marca hydrated a true 
    //    aunque no exista "menu-storage" en localStorage
    if (typeof window !== "undefined") {
      console.log("🔎 [useMenus] Buscando en localStorage la clave 'menu-storage'...");
      const persisted = useMenuStore.persist
        .getOptions()
        .storage?.getItem("menu-storage");

      if (persisted) {
        console.log("💿 [useMenus] 'menu-storage' SÍ existe => setHydrated(true)");
      } else {
        console.log("💿 [useMenus] 'menu-storage' NO encontrado => igual marcamos hydrated=true");
      }
      setHydrated(true);
    }

    return () => unsub?.(); // Limpieza de suscripción
  }, []);

  /**
   * 📡 Carga los menús desde el backend y los transforma a estructura jerárquica
   */
  const fetchMenus = useCallback(async (context = "default") => {
    try {
      setLoading(true);
      console.log(`📡 [useMenus] Obteniendo menús del backend (${context})...`);

      // Verificamos si el CSRF ya está rotado
      const csrfOk = await waitForRotatedCsrf();
      if (!csrfOk) {
        console.error("⛔ [useMenus] No se rotó el CSRF. Abortando fetch de menús.");
        return;
      }

      // Llamada real al endpoint de menús
      const response = await api.get<Menu[]>("/menus/my-menus");
      const menuTree = transformMenus(response.data);

      // Guardamos en Zustand
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
   * 🧠 Decide si se deben cargar los menús tras:
   * - Hidratar la store de menús
   * - Tener sessionReady = true
   * - Tener user logueado
   * - Y no haberse cargado menús todavía
   */
  useEffect(() => {
    const shouldLoad =
      hydrated &&
      sessionReady &&
      user &&
      (!menuLoaded || (menuLoaded && menus.length === 0));

    console.groupCollapsed("🧪 [useMenus] Diagnóstico");
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
