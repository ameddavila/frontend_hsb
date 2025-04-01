// ✅ Sidebar estilizado, jerárquico, colapsable y optimizado
"use client";

import React, { useMemo, useCallback } from "react";
import { PanelMenu } from "primereact/panelmenu";
import { MenuItem } from "primereact/menuitem";
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
  const { menus, loading } = useMenus();

  const buildMenuModel = useCallback(
    (items: MenuNode[]): MenuItem[] =>
      items.map((menu) => ({
        label: menu.name,
        icon: menu.icon,
        command: () => menu.path && router.push(menu.path),
        items: menu.children?.length ? buildMenuModel(menu.children) : undefined,
      })),
    [router]
  );

  const dynamicItems = useMemo(() => buildMenuModel(menus), [menus, buildMenuModel]);
  const sidebarClass = `sidebar ${open ? "expanded" : "collapsed"} ${className}`;

  if (loading) {
    return (
      <aside className={sidebarClass}>
        <div className="p-4 flex justify-center items-center h-full">
          <ProgressSpinner style={{ width: "40px", height: "40px" }} />
        </div>
      </aside>
    );
  }

  if (!menus.length) {
    return (
      <aside className={sidebarClass}>
        <div className="p-4 text-center text-sm text-red-500">
          ⚠️ No se pudo cargar el menú del usuario.
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
              onClick={() => item.command?.({} as any)}
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