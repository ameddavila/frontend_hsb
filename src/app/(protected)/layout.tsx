"use client";

import React from "react";
import Navbar from "@/components/Layout/Navbar";
import Sidebar from "@/components/Layout/Sidebar";
import PanelDerecho from "@/components/Layout/PanelDerecho";
import Footer from "@/components/Layout/Footer";
import { useSidebarStore } from "@/stores/sidebarStore";
import { usePanelStore } from "@/stores/panelStore"; // ✅ Nuevo store
import "@/styles/layout.css";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

// ✅ Este sí se queda como está
export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebarStore();
  const { isOpen: panelOpen, toggle: togglePanel } = usePanelStore();

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
