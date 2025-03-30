"use client";

import React, { useMemo, useCallback } from "react";
import { PanelMenu } from "primereact/panelmenu";
import { useRouter } from "next/navigation";
import { useMenus } from "@/hooks/useMenus";
import { MenuItem, MenuItemCommandEvent } from "primereact/menuitem";
import { MenuNode } from "@/types/Menu";

interface SidebarProps {
  open: boolean;
  className?: string;
}

export default function Sidebar({ open, className = "" }: SidebarProps) {
  const router = useRouter();
  const { menus, loading } = useMenus(); // ✅ ya transformados en MenuNode[]

  console.log("📦 Sidebar: Menús recibidos (MenuNode[]):", menus);
  console.log("📦 Sidebar: loading =", loading);

  // 🧠 Transforma MenuNode[] en estructura <MenuItem[]> para PanelMenu
  const buildMenuModel = useCallback(
    (items: MenuNode[]): MenuItem[] =>
      items.map((menu) => {
        const hasChildren = menu.children && menu.children.length > 0;
        return {
          label: menu.name,
          icon: menu.icon,
          command: () => router.push(menu.path),
          items: hasChildren ? buildMenuModel(menu.children) : undefined,
        };
      }),
    [router]
  );

  // ✅ Solo se reconstruye cuando `menus` cambia
  const dynamicItems = useMemo(() => buildMenuModel(menus), [menus, buildMenuModel]);

  const sidebarClass = `sidebar ${open ? "expanded" : "collapsed"} ${className}`;

  if (loading) {
    return (
      <aside className={sidebarClass}>
        <div className="p-4 text-center text-sm text-gray-500">🔄 Cargando menú...</div>
      </aside>
    );
  }

  if (!menus.length) {
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
        <div className="collapsed-menu p-2 flex flex-col gap-2 items-center">
          {dynamicItems.map((item, i) => (
            <button
              key={i}
              className="collapsed-icon p-2 cursor-pointer rounded hover:bg-gray-200"
              onClick={() => item.command?.({} as MenuItemCommandEvent)}
              title={item.label}
            >
              <i className={item.icon}></i>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
