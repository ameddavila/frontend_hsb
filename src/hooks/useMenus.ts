import { useEffect, useState, useCallback } from "react";
import api from "@/services/api";
import { useAuth } from "./useAuth";
import { useSessionReady } from "./useSessionReady";
import { useMenuStore } from "@/stores/menuStore";

export const useMenus = () => {
  // Obtenemos el usuario autenticado
  const { user } = useAuth();

  // Detecta si el evento "session-ready" fue emitido (tras login o refresh)
  const sessionReady = useSessionReady();

  // Zustand - menús
  const menus = useMenuStore((state) => state.menus);
  const setMenus = useMenuStore((state) => state.setMenus);
  const clearMenus = useMenuStore((state) => state.clearMenus);
  const setMenuLoaded = useMenuStore((state) => state.setMenuLoaded);

  // Verifica si los datos de menús fueron hidratados desde localStorage
  const [hydrated, setHydrated] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!useMenuStore.persist.getOptions().storage?.getItem("menu-storage");
  });

  // Controla el estado de carga local (para mostrar loading en UI)
  const [loading, setLoading] = useState(true);

  /**
   * 🔄 Escucha el evento de hidratación de Zustand (cuando termina de cargar el localStorage)
   */
  useEffect(() => {
    const unsub = useMenuStore.persist.onFinishHydration(() => {
      console.log("💾 Zustand hidratado (menuStore)");
      setHydrated(true);
    });
    return () => unsub?.();
  }, []);

  /**
   * 📡 Carga los menús desde el backend
   */
  const fetchMenus = useCallback(async (context = "default") => {
    try {
      setLoading(true);
      console.log(`📡 Obteniendo menús desde el backend (${context})...`);
      const res = await api.get("/menus/my-menus");

      setMenus(res.data); // ✅ Estructura jerárquica con children
      setMenuLoaded(true);

      console.log("📥 Menús recibidos y almacenados en Zustand:", res.data);
    } catch (err) {
      console.error("❌ Error al obtener menús:", err);
      clearMenus();
    } finally {
      setLoading(false);
    }
  }, [setMenus, clearMenus, setMenuLoaded]);

  /**
   * 🧠 Lógica para decidir si se deben cargar los menús desde el backend
   */
  useEffect(() => {
    console.groupCollapsed("🧩 useMenus: Verificación de carga de menús");
    console.log("✅ Zustand hidratado:", hydrated);
    console.log("✅ Sesión lista:", sessionReady);
    console.log("✅ Usuario presente:", !!user);
    console.groupEnd();

    // Ejecuta la lógica solo si: ya hidrató Zustand, sesión activa, y hay usuario
    if (hydrated && sessionReady && user) {
      const persistedMenus = useMenuStore.getState().menus;
      const loadedFlag = useMenuStore.getState().menuLoaded;

      // Si no hay menús o flag indica que no fueron cargados: obtener del backend
      if (persistedMenus.length === 0 || !loadedFlag) {
        console.log("🔄 Menús no presentes o no confirmados. Se inicia fetch...");
        fetchMenus("session-ready");
      } else {
        console.log("✅ Menús ya estaban en Zustand. No se hace fetch.");
        setLoading(false);
      }
    }
  }, [hydrated, sessionReady, user, fetchMenus]);

  return {
    menus,
    loading,
    fetchMenus,
  };
};
