import { useEffect, useState } from "react";
import api from "@/services/api"; // tu axios con CSRF y auth

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
  const [menus, setMenus] = useState<MenuNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await api.get("/menus/my-menus");
        console.log("✅ Menús recibidos:", res.data); // 👈 debug
        setMenus(res.data);
      } catch (err) {
        console.error("❌ Error al obtener menús:", err); // 👈 debug
      } finally {
        setLoading(false);
      }
    };
  
    fetchMenus();
  }, []);
  

  return { menus, loading };
};
