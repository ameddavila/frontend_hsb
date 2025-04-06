"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMenus } from "@/hooks/useMenus";
import { MenuNode } from "@/types/Menu";
import { useSidebarStore } from "@/stores/useSidebarStore";

interface SidebarMenuProps {
  open: boolean;
}

export default function SidebarMenu({ open }: SidebarMenuProps) {
  const router = useRouter();
  const { menus, loading } = useMenus();

  const {
    toggleGroup,
    isOpen,
    expandAll,
    collapseAll,
    areAnyGroupsOpen,
  } = useSidebarStore();

  // 🔁 IDs de todos los grupos con hijos
  const getAllGroupIds = (items: MenuNode[]): number[] => {
    const ids: number[] = [];

    const traverse = (nodes: MenuNode[]) => {
      nodes.forEach((node) => {
        if (node.children?.length) {
          ids.push(node.id);
          traverse(node.children);
        }
      });
    };

    traverse(items);
    return ids;
  };

  if (loading) return <div className="sidebar-loading">Cargando...</div>;
  if (!menus.length) return <div className="sidebar-error">⚠️ Menú vacío</div>;

  // 🧩 Renderiza ítems recursivamente
  const renderMenuItems = (items: MenuNode[], level = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isGroupOpen = isOpen(item.id);

      return (
        <div key={item.id} className={`sidebar-group level-${level}`}>
          <button
            className={`sidebar-group-header level-${level}`}
            onClick={() => {
              if (item.path) router.push(item.path);
              if (hasChildren) toggleGroup(item.id);
            }}
            title={item.name}
          >
            <i className={item.icon}></i>
            {open && <span>{item.name}</span>}
            {open && hasChildren && (
              <i
                className={`pi ${
                  isGroupOpen ? "pi-chevron-down" : "pi-chevron-right"
                } ml-auto`}
              />
            )}
          </button>

          {isGroupOpen && hasChildren && (
            <div className="sidebar-children">
              {renderMenuItems(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const allGroupIds = getAllGroupIds(menus);
  const showToggle = open && allGroupIds.length > 0;

  return (
    <nav className="sidebar-menu">
      {renderMenuItems(menus)}

      {/* 🔄 Botón toggle expandir/colapsar */}
      {showToggle && (
        <div className="sidebar-controls mt-4 flex justify-center">
          <button
            className="sidebar-btn"
            onClick={() =>
              areAnyGroupsOpen()
                ? collapseAll()
                : expandAll(allGroupIds)
            }
          >
            <i className={`pi ${areAnyGroupsOpen() ? "pi-minus" : "pi-plus"}`} />
            <span className="ml-2">
              {areAnyGroupsOpen() ? "" : ""}
            </span>
          </button>
        </div>
      )}
    </nav>
  );
}
