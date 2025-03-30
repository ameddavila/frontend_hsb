// src/app/(protected)/admin/layout.tsx
"use client";

import React, { useState } from "react";
import Navbar from "@/components/Layout/Navbar";
import Sidebar from "@/components/Layout/Sidebar";
import PanelDerecho from "@/components/Layout/PanelDerecho";
import Footer from "@/components/Layout/Footer";
import "@/styles/layout.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <div className="layout-container">
      <Navbar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onTogglePanel={() => setPanelOpen((prev) => !prev)}
      />

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
