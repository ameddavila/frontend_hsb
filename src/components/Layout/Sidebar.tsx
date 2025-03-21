"use client";

import React from "react";
import { Menu } from "primereact/menu";
import { classNames } from "primereact/utils";
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
        className={classNames(
          "p-2 transition-all overflow-hidden",
          {
            "w-16rem": open,
            "w-3rem": !open,
          }
        )}
        style={{
          minWidth: open ? "16rem" : "3rem",
          backgroundColor: "var(--color-bg-sidebar)",
          color: "var(--color-text-white)"
        }}
      >
      <Menu model={items} className="border-none" />
    </aside>
  );
}
