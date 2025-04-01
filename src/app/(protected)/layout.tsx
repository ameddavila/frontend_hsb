"use client";
// src/app/layout.tsx o dentro de globals.css
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@/styles/globals.css'; // Tus colores mandan

import React from "react";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
