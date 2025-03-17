// app/(public)/layout.tsx
"use client";
import Footer from "@/components/Footer/Footer";
import "@/styles/auth.css"; // si quisieras estilos específicos

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-layout">
      {/* Si quieres, pones un header minimal o nada */}
      <main>{children}</main>
      <Footer />
    </div>
  );
}
