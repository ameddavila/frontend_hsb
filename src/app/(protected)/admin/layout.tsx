// src/app/(protected)/admin/layout.tsx
"use client";

import React from "react";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
