"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Layout/Navbar";
import Sidebar from "@/components/Layout/Sidebar";
import PanelDerecho from "@/components/Layout/PanelDerecho";
import Footer from "@/components/Layout/Footer";
import { useSidebarStore } from "@/stores/sidebarStore";
import { usePanelStore } from "@/stores/panelStore";
import { useSessionReady } from "@/hooks/useSessionReady";
import { useMenuStore } from "@/stores/menuStore";
import "@/styles/layout.css";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebarStore();
  const { isOpen: panelOpen, toggle: togglePanel } = usePanelStore();

  const sessionReady = useSessionReady(); // ✅ Detecta si la sesión está lista (refresh/login)
  const menus = useMenuStore((state) => state.menus); // ✅ Accede al estado de menús desde Zustand

  // 📋 Seguimiento por consola para saber el estado
  useEffect(() => {
    console.log("🔒 [ProtectedLayout] sessionReady:", sessionReady);
    console.log("📁 [ProtectedLayout] Menús disponibles:", menus.length);
  }, [sessionReady, menus]);

  // 🧠 Mientras la sesión aún no está lista, mostramos una pantalla de carga
  if (!sessionReady) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-white bg-blue-900">
        <i className="pi pi-spin pi-spinner mr-2" /> Cargando sistema...
      </div>
    );
  }

  // ✅ Render normal cuando la sesión está lista
  return (
    <div className="layout-container">
      <Navbar onToggleSidebar={toggleSidebar} onTogglePanel={togglePanel} />

      <div className={`layout-content ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
        <Sidebar open={sidebarOpen} />
        <main className="layout-main">{children}</main>
        {panelOpen && (
          <aside className="panel-derecho animated-panel">
            <PanelDerecho />
          </aside>
        )}
      </div>

      <Footer />
    </div>
  );
}
