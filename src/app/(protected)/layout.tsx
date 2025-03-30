"use client";

import React, { useState } from "react";
import Navbar from "@/components/Layout/Navbar";
import Sidebar from "@/components/Layout/Sidebar";
import PanelDerecho from "@/components/Layout/PanelDerecho";
import Footer from "@/components/Layout/Footer";
import "@/styles/layout.css";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
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
      <Navbar onToggleSidebar={handleToggleSidebar} onTogglePanel={handleTogglePanel} />

      <div className="layout-content">
        <Sidebar open={sidebarOpen} />

        <main className={`layout-main ${sidebarOpen ? "expanded" : "collapsed"}`}>
          {children}
        </main>

        {panelOpen && (
          <aside className="panel-derecho">
            <PanelDerecho />
          </aside>
        )}
      </div>

      <Footer />
    </div>
  );
}