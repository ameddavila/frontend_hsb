"use client";

import React from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onToggleSidebar: () => void;
  onTogglePanel: () => void;
}

export default function Navbar({ onToggleSidebar, onTogglePanel }: NavbarProps) {
  const router = useRouter();

  // El menú principal se pasa en "model"
  const menubarModel = [
    {
      label: "Hospital Santa Bárbara",
      icon: "pi pi-home",
      command: () => {
        void router.push("/dashboard");
      },
    },
  ];
  

  // Creamos un componente para la sección "end"
  const endComponent = (
    <div className="flex align-items-center gap-2">
      <Button
        label="Notificaciones"
        icon="pi pi-bell"
        className="p-button navbar-btn"
        onClick={() => alert("Notificaciones...")}
      />
      <Button
        label="Salir"
        icon="pi pi-sign-out"
        className="p-button navbar-btn"
        onClick={() => {
          void router.push("/logout");
        }}
      />
    </div>
  );

  // Elementos "start" para toggles (Sidebar y Panel Derecho)
  const start = (
    <div className="flex align-items-center">
      <Button
        icon="pi pi-bars"
        className="p-button-text mr-2"
        onClick={onToggleSidebar}
        aria-label="Toggle Sidebar"
      />
      <Button
        icon="pi pi-window-maximize"
        className="p-button-text mr-2"
        onClick={onTogglePanel}
        aria-label="Toggle Panel Derecho"
      />
    </div>
  );

  return (
    <Menubar
      model={menubarModel}
      start={start}
      end={endComponent}
      className="navbar border-none shadow-1"
      style={{ backgroundColor: "var(--color-bg-sidebar)", 
              color: "var(--color-text-white)" 
            }}
    />
  );
}
