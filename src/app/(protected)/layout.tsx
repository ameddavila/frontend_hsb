// app/(protected)/layout.tsx
"use client";

import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import Footer from "@/components/Footer/Footer";
import "@/styles/globals.css";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="protected-layout" style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar a la izquierda */}
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Navbar arriba */}
        <Navbar />

        {/* Contenido principal */}
        <main style={{ flex: 1 }}>{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
