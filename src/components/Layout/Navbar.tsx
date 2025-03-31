"use client";

import React, { useEffect } from "react";
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

  useEffect(() => {
    console.log("[Navbar] Se renderiza.");
  }, []);

  const menubarModel = [
    {
      label: "Hospital Santa Bárbara",
      icon: "pi pi-home",
      command: () => {
        console.log("[Navbar] Menubar command => /dashboard");
        void router.push("/dashboard");
      },
      className: "home-button",
    },
  ];

  const endComponent = (
    <div className="flex align-items-center gap-3">
      <Button
        icon="pi pi-bell"
        className="p-button navbar-btn"
        onClick={() => {
          console.log("[Navbar] Notificaciones (placeholder)");
          alert("🔔 Notificaciones...");
        }}
      />
      <UserAvatarMenu /> {/* Usamos el nuevo componente de avatar */}
    </div>
  );

  const start = (
    <div className="flex align-items-center">
      <Button
        icon="pi pi-bars"
        className="p-button-text mr-2"
        onClick={() => {
          console.log("[Navbar] onToggleSidebar()");
          onToggleSidebar();
        }}
        aria-label="Toggle Sidebar"
      />
      <Button
        icon="pi pi-window-maximize"
        className="p-button-text mr-2"
        onClick={() => {
          console.log("[Navbar] onTogglePanel()");
          onTogglePanel();
        }}
        aria-label="Toggle Panel Derecho"
      />
    </div>
  );

  return (
    <Menubar
      start={start}
      model={menubarModel}
      end={endComponent}
      className="navbar border-none shadow-1"
      style={{
        backgroundColor: "var(--color-bg-sidebar)",
        color: "var(--color-text-white)",
      }}
    />
  );
}
