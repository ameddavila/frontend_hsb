"use client";

import React, { useState } from "react";
import Navbar from "@/components/Layout/Navbar";
import Sidebar from "@/components/Layout/Sidebar";
import PanelDerecho from "@/components/Layout/PanelDerecho";
import Footer from "@/components/Layout/Footer";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  // Controlar visibilidad de la sidebar y el panel derecho
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [panelOpen, setPanelOpen] = useState<boolean>(true);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleTogglePanel = () => {
    setPanelOpen((prev) => !prev);
  };

  return (
    <div className="layout-container">
      {/* Navbar Superior */}
      <Navbar onToggleSidebar={handleToggleSidebar} onTogglePanel={handleTogglePanel} />

      <div className="layout-content">
        {/* Sidebar (menú lateral) */}
        <Sidebar open={sidebarOpen} />

        {/* Contenido principal con margen dinámico */}
        <main className={`layout-main ${sidebarOpen ? "expanded" : "collapsed"}`}>
          {children}
        </main>

        {/* Panel derecho, si está abierto */}
        {panelOpen && <PanelDerecho />}
      </div>

      {/* Footer al final */}
      <Footer />
    </div>
  );
}
