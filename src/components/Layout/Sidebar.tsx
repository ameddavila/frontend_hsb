"use client";

import React from "react";
import { Menu } from "primereact/menu";
import { useRouter } from "next/navigation";
import { useMenus, MenuNode } from "@/hooks/useMenus";
import { MenuItem } from "primereact/menuitem";
import { MenuItemCommandEvent } from "primereact/menuitem";

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const router = useRouter();
  const { menus, loading } = useMenus();

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

  if (loading) {
    return (
      <aside className={`sidebar ${open ? "expanded" : "collapsed"}`}>
        <div className="p-4 text-center text-sm text-gray-500">
          🔄 Cargando menú...
        </div>
      </aside>
    );
  }

  if (!menus || menus.length === 0) {
    return (
      <aside className={`sidebar ${open ? "expanded" : "collapsed"}`}>
        <div className="p-4 text-center text-sm text-red-500">
          ⚠️ No se pudo cargar el menú.
        </div>
      </aside>
    );
  }

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
              onClick={() => item.command?.({} as MenuItemCommandEvent)}
            >
              <i className={item.icon}></i>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
