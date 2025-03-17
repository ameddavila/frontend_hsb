// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import "@/styles/sidebar.css"; // Estilos dedicados

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside className={`sidebar ${open ? "open" : "collapsed"}`}>
      <button className="toggle-btn" onClick={() => setOpen(!open)}>
        {open ? "<<" : ">>"}
      </button>
      <nav>
        <Link href="/dashboard">🏠 Inicio</Link>
        <Link href="/profile">👤 Mi perfil</Link>
        <Link href="/transfers">💸 Transferencias</Link>
        <Link href="/services">⚙️ Servicios</Link>
      </nav>
    </aside>
  );
}
