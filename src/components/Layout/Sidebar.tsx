"use client";

import React, { useMemo, useCallback } from "react";
import { PanelMenu } from "primereact/panelmenu";
import { MenuItem, MenuItemCommandEvent } from "primereact/menuitem";
import { useRouter } from "next/navigation";
import { useMenus } from "@/hooks/useMenus";
import { MenuNode } from "@/types/Menu";
import { ProgressSpinner } from "primereact/progressspinner";

interface SidebarProps {
  open: boolean;
  className?: string;
}

export default function Sidebar({ open, className = "" }: SidebarProps) {
  const router = useRouter();
  const { menus, loading } = useMenus(); // ✅ Menús jerárquicos desde Zustand

  // 🧠 Transforma MenuNode[] en estructura compatible con PanelMenu
  const buildMenuModel = useCallback(
    (items: MenuNode[]): MenuItem[] =>
      items.map((menu) => {
        const hasChildren = !!menu.children?.length;
        return {
          label: menu.name,
          icon: menu.icon,
          command: () => {
            if (menu.path) router.push(menu.path);
          },
          items: hasChildren ? buildMenuModel(menu.children) : undefined,
        };
      }),
    [router]
  );

  // ✅ Memoizamos los items para evitar renders innecesarios
  const dynamicItems = useMemo(() => buildMenuModel(menus), [menus, buildMenuModel]);

  // 🎨 Clases condicionales según estado de apertura
  const sidebarClass = `sidebar ${open ? "expanded" : "collapsed"} ${className}`;

  // ⏳ Mientras se cargan los menús
  if (loading) {
    return (
      <aside className={sidebarClass}>
        <div className="p-4 flex justify-center items-center h-full">
          <ProgressSpinner style={{ width: "40px", height: "40px" }} />
        </div>
      </aside>
    );
  }

  // ⚠️ Si no hay menús (posible error)
  if (!menus.length) {
    return (
      <aside className={sidebarClass}>
        <div className="p-4 text-center text-sm text-red-500">
          ⚠️ No se pudo cargar el menú del usuario.
        </div>
      </aside>
    );
  }

  // ✅ Render normal
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
              aria-label={item.label}
            >
              <i className={item.icon}></i>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
