// app/(protected)/layout.tsx
"use client";

import Navbar from "@/components/Layout/Navbar";
import Sidebar from "@/components/Layout/Sidebar";
import Footer from "@/components/Layout/Footer";
import PanelDerecho from "@/components/Layout/PanelDerecho";
import "@/styles/layout.css"; // Importamos estilos globales

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-container">
      {/* Navbar superior */}
      <Navbar />

      <div className="layout-content">
        {/* Sidebar (Menú lateral contraíble) */}
        <Sidebar />

        {/* Contenido Principal */}
        <main className="layout-main">{children}</main>

        {/* Panel lateral derecho con widgets */}
        <PanelDerecho />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
