"use client";

import React from "react";
import { Menu } from "primereact/menu";
import { useRouter } from "next/navigation";

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const router = useRouter();

  const items = [
    {
      label: "Inicio",
      icon: "pi pi-home",
      command: () => {
        void router.push("/dashboard");
      },
    },
    {
      label: "Mi Perfil",
      icon: "pi pi-user",
      command: () => {
        void router.push("/profile");
      },
    },
    {
      label: "Transferencias",
      icon: "pi pi-money-bill",
      command: () => {
        void router.push("/transfers");
      },
    },
    {
      label: "Servicios",
      icon: "pi pi-briefcase",
      command: () => {
        void router.push("/services");
      },
    },
  ];

  return (
    <aside
      className={`sidebar ${open ? "expanded" : "collapsed"}`}
    >
      {/* Menú que se muestra solo si la Sidebar está expandida */}
      {open && <Menu model={items} className="sidebar-menu border-none" />}
      
      {/* Íconos individuales que se muestran cuando la Sidebar está colapsada */}
      {!open && (
        <div className="collapsed-menu">
          {items.map((item, index) => (
            <div key={index} className="collapsed-icon" onClick={item.command}>
              <i className={item.icon}></i>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
