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

const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

const waitForNewCsrfToken = async (maxWaitMs = 1000): Promise<string | null> => {
  const interval = 50;
  let waited = 0;
  while (waited < maxWaitMs) {
    const token = getCookieValue("csrfToken");
    if (token) return token;
    await new Promise((r) => setTimeout(r, interval));
    waited += interval;
  }
  console.warn("⏰ Tiempo agotado esperando CSRF token");
  return null;
};

export const useMenus = () => {
  const [menus, setMenus] = useState<MenuNode[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        console.log("📡 Cargando menús...");

        const token = await waitForNewCsrfToken();
        console.log("🔍 CSRF token encontrado en useMenus:", token);
        if (!token) {
          console.error("❌ CSRF token no disponible. Cancelando carga.");
          return;
        }

        const res = await api.get("/menus/my-menus");
        console.log("✅ Menús recibidos:", res.data);
        setMenus(res.data);
      } catch (err) {
        console.error("❌ Error al obtener menús:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (user) {
        fetchMenus();
      } else {
        console.log("🚫 No hay usuario autenticado. No se cargan menús.");
        setLoading(false); // Evita que se quede en estado de carga
      }
    }
  }, [authLoading, user]);

  return { menus, loading };
};
