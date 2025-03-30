// utils/transformMenus.ts
import { Menu, MenuNode } from "@/types/Menu"; // ✅ Todo viene de types

export function transformMenus(menus: Menu[]): MenuNode[] {
  const map = new Map<number, MenuNode>();
  const roots: MenuNode[] = [];

  // Paso 1: crear nodos individuales con children vacíos
  menus.forEach((menu) => {
    map.set(menu.id, {
      ...menu,
      parentId: menu.parentId ?? null, // Normalizamos el tipo
      children: [],
    });
  });

  // Paso 2: construir jerarquía padre → hijos
  menus.forEach((menu) => {
    const node = map.get(menu.id)!;
    const parentId = menu.parentId ?? null;

    if (parentId !== null && map.has(parentId)) {
      map.get(parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}
