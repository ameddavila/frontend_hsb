"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMenus } from "@/hooks/useMenus";
//import { MenuNode } from "@/types/Menu";
import { ProgressSpinner } from "primereact/progressspinner";
import SidebarMenu from "@/components/Layout/SidebarMenu"; // 👈 Asegúrate de importar correctamente

interface SidebarProps {
  open: boolean;
  className?: string;
}

export default function Sidebar({ open, className = "" }: SidebarProps) {
  const router = useRouter();
  const { menus, loading } = useMenus();
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
    <SidebarMenu open={open} />
  ) : (
    <div className="collapsed-menu p-2 flex flex-col gap-2 items-center">
      {menus.flatMap((group) =>
        group.children?.map((child) => (
          <button
            key={child.id}
            className="collapsed-icon p-2 cursor-pointer rounded hover:bg-gray-200"
            onClick={() => child.path && router.push(child.path)}
            title={child.name}
            aria-label={child.name}
          >
            <i className={child.icon}></i>
          </button>
        )) || []
      )}
    </div>
  )}
</aside>

  );
}
