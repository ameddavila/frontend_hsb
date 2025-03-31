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
  // Lógica de sidebar y panel
  const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebarStore();
  const { isOpen: panelOpen, toggle: togglePanel } = usePanelStore();

  // Verifica si ya está la sesión lista, en caso uses "session-ready" event
  const sessionReady = useSessionReady();
  const menus = useMenuStore((state) => state.menus);

  useEffect(() => {
    console.log("[ProtectedLayout] Se renderiza.");
    console.log("[ProtectedLayout] sessionReady:", sessionReady);
    console.log("[ProtectedLayout] menus.length:", menus.length);
  }, [sessionReady, menus]);

  // Si sessionReady es false, mostramos un spinner
  if (!sessionReady) {
    console.log("[ProtectedLayout] sessionReady es false => mostrando Spinner...");
    return (
      <div className="w-screen h-screen flex justify-center items-center text-white bg-blue-900">
        <i className="pi pi-spin pi-spinner mr-2" /> Cargando sistema...
      </div>
    );
  }

  // Cuando sessionReady es true, renderizamos la UI normal
  console.log("[ProtectedLayout] sessionReady es true => render normal");
  return (
    <div className="layout-container">
      <Navbar onToggleSidebar={toggleSidebar} onTogglePanel={togglePanel} />

      <div
        className={`layout-content ${
          sidebarOpen ? "sidebar-open" : "sidebar-collapsed"
        }`}
      >
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
