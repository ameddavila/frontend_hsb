"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/services/api";
import { useAuth } from "./useAuth";
import { useSessionReady } from "./useSessionReady";
import { useMenuStore } from "@/stores/menuStore";

export interface MenuNode {
  id: number;
  name: string;
  path: string;
  parentId: number | null;
  icon?: string;
  isActive?: boolean;
  children: MenuNode[];
}

export const useMenus = () => {
  const { user } = useAuth();
  const sessionReady = useSessionReady(() => {
    console.log("🧩 useMenus detectó que session-ready fue emitido");
    if (user && menus.length === 0) {
      fetchMenus("session-ready");
    }
  });

  const menus = useMenuStore((state) => state.menus);
  const setMenus = useMenuStore((state) => state.setMenus);
  const clearMenus = useMenuStore((state) => state.clearMenus);
  const [loading, setLoading] = useState(menus.length === 0); // mejora: no mostrar loading si ya hay menús

  const fetchMenus = useCallback(async (context = "default") => {
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
  }, [setMenus, clearMenus]);

  // 🧠 Carga directa si ya hay sesión activa y aún no hay menús
  useEffect(() => {
    if (user && sessionReady && menus.length === 0) {
      console.log("📦 Carga directa desde useMenus (estado limpio)");
      fetchMenus("carga directa");
    }
  }, [user, sessionReady, menus.length, fetchMenus]);

  return { menus, loading };
};
