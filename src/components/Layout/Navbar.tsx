// ✅ Componente Navbar mejorado
"use client";

import React from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import UserAvatarMenu from "@/components/Layout/UserAvatarMenu";

interface NavbarProps {
  onToggleSidebar: () => void;
  onTogglePanel: () => void;
}

export default function Navbar({ onToggleSidebar, onTogglePanel }: NavbarProps) {
  const router = useRouter();

  const menubarModel = [
    {
      label: "Hospital Santa Bárbara",
      icon: "pi pi-home",
      command: () => router.push("/dashboard"),
      className: "home-button",
    },
  ];

  const start = (
    <div className="flex align-items-center gap-2">
      <Button
        icon="pi pi-bars"
        className="p-button-text"
        onClick={onToggleSidebar}
        aria-label="Alternar menú lateral"
      />
      <Button
        icon="pi pi-window-maximize"
        className="p-button-text"
        onClick={onTogglePanel}
        aria-label="Alternar panel derecho"
      />
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-3">
      <Button
        icon="pi pi-bell"
        className="navbar-btn"
        onClick={() => alert("🔔 Notificaciones... (pendiente de implementar)")}
      />
      <UserAvatarMenu />
    </div>
  );

  return (
    <Menubar
      model={menubarModel}
      start={start}
      end={end}
      className="navbar border-none shadow-2"
    />
  );
}
