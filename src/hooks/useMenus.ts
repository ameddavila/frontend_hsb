"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "./useAuth";

export interface MenuNode {
  id: number;
  name: string;
  path: string;
  parentId: number | null;
  icon?: string;
  isActive?: boolean;
  children: MenuNode[];
}

const waitForCookie = async (name: string, maxWait = 1000): Promise<string | null> => {
  const interval = 50;
  let waited = 0;
  while (waited < maxWait) {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    if (match) return match[2];
    await new Promise((r) => setTimeout(r, interval));
    waited += interval;
  }
  console.warn(`⏰ Tiempo agotado esperando cookie: ${name}`);
  return null;
};

export const useMenus = () => {
  const [menus, setMenus] = useState<MenuNode[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  const fetchMenus = async (context = "default") => {
    try {
      setLoading(true);
      console.log(`📡 Cargando menús... (${context})`);

      const csrf = await waitForCookie("csrfToken");
      const access = await waitForCookie("accessToken");
      if (!csrf || !access) {
        console.error("❌ No hay CSRF o accessToken. Cancelando carga de menús.");
        return;
      }

      const res = await api.get("/menus/my-menus");
      console.log("📥 Menús recibidos:", res.data);
      setMenus(res.data);
    } catch (err) {
      console.error("❌ Error al obtener menús:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      console.log("✅ Usuario autenticado. Cargando menús...");
      fetchMenus("primera carga");
    } else if (!authLoading && !user) {
      console.log("🚫 No hay usuario autenticado. No se cargan menús.");
      setMenus([]);
      setLoading(false);
    }
  }, [authLoading, user]);

  useEffect(() => {
    const onRestore = () => {
      if (user) {
        console.log("🔁 Sesión restaurada. Reintentando carga de menús...");
        fetchMenus("session-restored");
      }
    };
    window.addEventListener("session-restored", onRestore);
    return () => window.removeEventListener("session-restored", onRestore);
  }, [user]);

  return { menus, loading };
};
