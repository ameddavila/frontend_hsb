// utils/transformMenus.ts
import { Menu, MenuNode } from "@/types/Menu";

/**
 * Transforma un array plano de menús a estructura jerárquica tipo árbol (MenuNode[])
 */
export function transformMenus(menus: Menu[]): MenuNode[] {
  const map = new Map<number, MenuNode>();
  const roots: MenuNode[] = [];

  // Paso 1️⃣: Crear nodos individuales
  menus.forEach((menu) => {
    map.set(menu.id, {
      ...menu,
      parentId: menu.parentId ?? null,
      children: [],
    });
  });

  // Paso 2️⃣: Construir jerarquía padre → hijos
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
