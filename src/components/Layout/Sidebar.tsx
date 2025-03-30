"use client";

import React from "react";
import { PanelMenu } from "primereact/panelmenu";
import { useRouter } from "next/navigation";
import { useMenus } from "@/hooks/useMenus";
import { MenuNode } from "@/stores/menuStore";
import { MenuItem, MenuItemCommandEvent } from "primereact/menuitem";

interface SidebarProps {
  open: boolean;
  className?: string;
}

export default function Sidebar({ open, className = "" }: SidebarProps) {
  const router = useRouter();
  const { menus, loading } = useMenus();

  console.log("🧩 Menús del backend:", menus);
  console.log("📦 Sidebar: loading =", loading, "| total menús =", menus.length);

  const buildMenuModel = (items: MenuNode[]): MenuItem[] =>
    items.map((menu) => ({
      label: menu.name,
      icon: menu.icon,
      command: () => router.push(menu.path),
      items: menu.children?.length ? buildMenuModel(menu.children) : undefined,
    }));

  const dynamicItems = buildMenuModel(menus);
  const sidebarClass = `sidebar ${open ? "expanded" : "collapsed"} ${className}`;

  if (loading) {
    return (
      <aside className={sidebarClass}>
        <div className="p-4 text-center text-sm text-gray-500">
          🔄 Cargando menú...
        </div>
      </aside>
    );
  }

  if (!menus || menus.length === 0) {
    return (
      <aside className={sidebarClass}>
        <div className="p-4 text-center text-sm text-red-500">
          ⚠️ No se pudo cargar el menú.
        </div>
      </aside>
    );
  }

  return (
    <aside className={sidebarClass}>
      {open ? (
        <PanelMenu
          model={dynamicItems}
          className="custom-sidebar border-none w-full"
        />
      ) : (
        <div className="collapsed-menu p-2">
          {dynamicItems.map((item, i) => (
            <div
              key={i}
              className="collapsed-icon p-2 cursor-pointer"
              onClick={() => item.command?.({} as MenuItemCommandEvent)}
              title={item.label}
            >
              <i className={item.icon}></i>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
