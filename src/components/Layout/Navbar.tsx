"use client";

import React from "react";
import { useRouter } from "next/navigation";
//import { Button } from "primereact/button";
import UserAvatarMenu from "@/components/Layout/UserAvatarMenu";

interface NavbarProps {
  onToggleSidebar: () => void;
  onTogglePanel: () => void;
}

export default function Navbar({ onToggleSidebar, onTogglePanel }: NavbarProps) {
  const router = useRouter();

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Sección Izquierda: Toggles */}
        <div className="navbar-section">
          <button
            className="navbar-btn"
            onClick={onToggleSidebar}
            aria-label="Alternar menú lateral"
          >
            <i className="pi pi-bars" />
          </button>
          <button
            className="navbar-btn"
            onClick={onTogglePanel}
            aria-label="Alternar panel derecho"
          >
            <i className="pi pi-window-maximize" />
          </button>
        </div>

        {/* Sección Central: Logo */}
        <div
          className="navbar-title"
          onClick={() => router.push("/dashboard")}
          title="Ir al Dashboard"
        >
          <i className="pi pi-home" />
          <span>Hospital Santa Bárbara</span>
        </div>

        {/* Sección Derecha: Notificaciones + Avatar */}
        <div className="navbar-section">
          <button
            className="navbar-btn"
            onClick={() => alert("🔔 Notificaciones...")}
            aria-label="Notificaciones"
          >
            <i className="pi pi-bell" />
          </button>
          <UserAvatarMenu />
        </div>
      </div>
    </header>
  );
}
