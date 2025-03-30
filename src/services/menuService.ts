// 📁 src/services/menuService.ts
import api from "./api";

// Tipos
export interface MenuInput {
  nombre: string;
  ruta: string;
  icono: string;
  padreId?: number | null;
}

export interface Menu extends MenuInput {
  id: number;
  padre?: Menu;
}

// Menús del usuario autenticado (Sidebar)
export const fetchUserMenus = async (): Promise<Menu[]> => {
  try {
    const res = await api.get("/menus/my-menus");
    console.log("📦 Menús desde menuService:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error al obtener menús (my-menus):", error);
    throw error;
  }
};

// CRUD general
export const getMenus = async (): Promise<Menu[]> => {
  const res = await api.get("/menus");
  return res.data;
};

export const getMenuById = async (id: number): Promise<Menu> => {
  const res = await api.get(`/menus/${id}`);
  return res.data;
};

export const createMenu = async (menu: MenuInput): Promise<Menu> => {
  const res = await api.post("/menus", menu);
  return res.data;
};

export const updateMenu = async (id: number, menu: MenuInput): Promise<Menu> => {
  const res = await api.put(`/menus/${id}`, menu);
  return res.data;
};

export const deleteMenu = async (id: number): Promise<{ message: string }> => {
  const res = await api.delete(`/menus/${id}`);
  return res.data;
};
