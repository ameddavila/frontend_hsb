// src/app/(protected)/layout.tsx
import ProtectedLayout from "@/components/Layout/ProtectedLayout"; // ✅ Importación sin llaves

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
