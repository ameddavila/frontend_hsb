// app/(protected)/layout.tsx
"use client";

import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import Footer from "@/components/Footer/Footer";
import "@/styles/layout.css"; // Usaremos este archivo para estructurar

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout-container">
      {/* Navbar (Superior) */}
      <Navbar />

      <div className="layout-content">
        {/* Sidebar (Izquierda) */}
        <Sidebar />

        {/* Contenido Principal */}
        <main className="layout-main">{children}</main>

        {/* Panel Lateral (Derecha) */}
        <aside className="layout-aside">
          <h3>Últimas Transacciones</h3>
          {/* Aquí puedes incluir contenido dinámico como widgets, notificaciones, etc. */}
        </aside>
      </div>

      {/* Footer (Opcional) */}
      <Footer />
    </div>
  );
}
