"use client";

import React from "react";
import { Menu } from "primereact/menu";
import { useRouter } from "next/navigation";
import { useMenus, MenuNode } from "@/hooks/useMenus";
import { MenuItem } from "primereact/menuitem";
import { MenuItemCommandEvent } from "primereact/menuitem"; // ✅ importar tipo

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const router = useRouter();
  const { menus, loading } = useMenus();

  // Construir estructura compatible con Menu de PrimeReact
  const buildMenuModel = (items: MenuNode[]): MenuItem[] => {
    return items.map((menu) => ({
      label: menu.name,
      icon: menu.icon,
      command: () => router.push(menu.path),
      items:
        menu.children && menu.children.length > 0
          ? buildMenuModel(menu.children)
          : undefined,
    }));
  };

  const dynamicItems = buildMenuModel(menus);

  if (loading) return <div className="p-4">Cargando menú...</div>;

  return (
    <aside className={`sidebar ${open ? "expanded" : "collapsed"}`}>
      {open ? (
        <Menu model={dynamicItems} className="sidebar-menu border-none" />
      ) : (
        <div className="collapsed-menu p-2">
          {dynamicItems.map((item, i) => (
            <div
              key={i}
              className="collapsed-icon p-2 cursor-pointer"
              onClick={() => item.command?.({} as MenuItemCommandEvent)} // ✅ tipo correcto
            >
              <i className={item.icon}></i>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
