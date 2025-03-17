// components/Navbar.tsx
"use client";

import Link from "next/link";
import "@/styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="brand">SISHSB</span>
      <div className="navbar-links">
        <Link href="/notifications">🔔 Notificaciones</Link>
        <Link href="/logout">🚪 Salir</Link>
      </div>
    </nav>
  );
}
