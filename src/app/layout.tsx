// src/app/layout.tsx
import { AuthProvider } from "@/context/AuthContext";
//import "primereact/resources/primereact.css";
import "primereact/resources/primereact.min.css";
//import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import '@/styles/main.css';
import { Toaster } from "sonner";

export const metadata = {
  title: "Nombre de tu app",
  description: "Descripción de tu app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="layout-root">
        <AuthProvider>
          <Toaster richColors position="top-center" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
