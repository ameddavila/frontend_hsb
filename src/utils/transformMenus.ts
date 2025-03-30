// src/utils/transformMenus.ts
import { MenuItem } from "primereact/menuitem";

interface MenuNode {
  id: number;
  name: string;
  path: string;
  icon?: string;
  children?: MenuNode[];
}

export const transformToPrimeMenu = (nodes: MenuNode[]): MenuItem[] => {
  return nodes.map((node) => ({
    label: node.name,
    icon: node.icon,
    command: () => {
      window.location.href = node.path;
    },
    items: node.children ? transformToPrimeMenu(node.children) : undefined,
  }));
};