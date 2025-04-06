// ✅ Componente ProtectedLayout optimizado y seguro
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Layout/Navbar";
import Sidebar from "@/components/Layout/Sidebar";
import PanelDerecho from "@/components/Layout/PanelDerecho";
import Footer from "@/components/Layout/Footer";
import { useSidebarStore } from "@/stores/sidebarStore";
import { usePanelStore } from "@/stores/panelStore";
import { useSessionReady } from "@/hooks/useSessionReady";
import { useUserStore } from "@/stores/useUserStore";
import { useMenuStore } from "@/stores/menuStore";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const sessionReady = useSessionReady();
  const user = useUserStore((state) => state.user);
  const menus = useMenuStore((state) => state.menus);
  const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebarStore();
  const { isOpen: panelOpen, toggle: togglePanel } = usePanelStore();

  // 🔐 Redirigir si no hay sesión
  useEffect(() => {
    if (sessionReady && !user) {
      console.warn("🚫 [ProtectedLayout] No hay sesión activa => redirigiendo a /login");
      router.replace("/login");
    }
  }, [sessionReady, user, router]);

  // 🐛 Debug en consola
  useEffect(() => {
    console.log("[ProtectedLayout] sessionReady:", sessionReady);
    console.log("[ProtectedLayout] menus.length:", menus.length);
  }, [sessionReady, menus]);

  // ⏳ Mientras esperamos la sesión
  if (!sessionReady || !user) {
    return (
      <div className="w-screen h-screen flex justify-content-center align-items-center text-white bg-blue-900">
        <i className="pi pi-spin pi-spinner mr-2" /> Cargando sistema...
      </div>
    );
  }
  
  // ❌ No debería pasar pero por seguridad, si no hay user no renderizamos
  if (sessionReady && !user) return null;

  // ✅ Render completo si todo está listo
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
