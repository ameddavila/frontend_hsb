// src/services/menuService.ts
import api from "./api";
import { Menu } from "@/types/Menu";

// Para crear o actualizar, usamos un tipo reducido:
export interface MenuInput {
  name: string;
  path: string;
  icon?: string;
  parentId?: number | null;
}

// Menús del usuario autenticado (Sidebar)
export const fetchUserMenus = async (): Promise<Menu[]> => {
  const res = await api.get("/menus/my-menus");
  return res.data;
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
