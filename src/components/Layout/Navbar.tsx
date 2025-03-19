// components/Layout/Navbar.tsx
"use client";

import { Menubar } from "primereact/menubar";
import "@/styles/navbar.css";

export default function Navbar() {
  const items = [
    {
      label: "Notificaciones",
      icon: "pi pi-bell",
    },
    {
      label: "Salir",
      icon: "pi pi-sign-out",
      command: () => (window.location.href = "/logout"),
    },
  ];

  return (
    <nav className="navbar">
      <span className="brand">SISHSB</span>
      <Menubar model={items} className="navbar-menu" />
    </nav>
  );
}
