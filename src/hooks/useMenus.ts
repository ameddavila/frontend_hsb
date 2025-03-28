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
  const [loading, setLoading] = useState(menus.length === 0);

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
    if (user && sessionReady && menus.length === 0) {
      console.log("📦 useMenus: menús vacíos, realizando fetch");
      fetchMenus("primera carga");
    } else {
      if (menus.length > 0) {
        console.log("✅ useMenus: usando menús persistidos en Zustand");
        setLoading(false);
      }
    }
  }, [user, sessionReady]);

  return { menus, loading };
};
