// src/services/menuService.ts
import api from "./api";
import { Menu } from "@/types/Menu";

// 🎯 Tipo base para crear/editar
export interface MenuInput {
  name: string;
  path: string;
  icon?: string;
  parentId?: number | null;
}

// 🔒 Menús del usuario autenticado (Sidebar)
export const fetchUserMenus = async (): Promise<Menu[]> => {
  const res = await api.get<Menu[]>("/menus/my-menus");
  return res.data;
};

// 📋 Listado general
export const getMenus = async (): Promise<Menu[]> => {
  const res = await api.get<Menu[]>("/menus");
  return res.data;
};

// 🔍 Obtener menú por ID
export const getMenuById = async (id: number): Promise<Menu> => {
  const res = await api.get<Menu>(`/menus/${id}`);
  return res.data;
};

// ➕ Crear nuevo menú
export const createMenu = async (menu: MenuInput): Promise<Menu> => {
  const res = await api.post<Menu>("/menus", menu);
  return res.data;
};

// ✏️ Actualizar menú
export const updateMenu = async (id: number, menu: MenuInput): Promise<Menu> => {
  const res = await api.put<Menu>(`/menus/${id}`, menu);
  return res.data;
};

// 🗑️ Eliminar menú
export const deleteMenu = async (id: number): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(`/menus/${id}`);
  return res.data;
};
