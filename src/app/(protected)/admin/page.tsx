// src/app/(protected)/admin/page.tsx
"use client";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

export default function AdminHome() {
  const router = useRouter();

  const sections = [
    {
      title: "Usuarios",
      description: "Administra todos los usuarios del sistema.",
      icon: "pi pi-users",
      path: "/admin/users",
      buttonLabel: "Ver usuarios",
      buttonClass: "button-primary",
    },
    {
      title: "Roles",
      description: "Gestiona los roles y permisos del sistema.",
      icon: "pi pi-id-card",
      path: "/admin/roles",
      buttonLabel: "Ver roles",
      buttonClass: "button-secondary",
    },
    {
      title: "Permisos",
      description: "Configura los permisos para cada rol.",
      icon: "pi pi-key",
      path: "/admin/permissions",
      buttonLabel: "Ver permisos",
      buttonClass: "button-secondary",
    },
    {
      title: "Menús",
      description: "Organiza los menús de navegación del sistema.",
      icon: "pi pi-list",
      path: "/admin/menus",
      buttonLabel: "Ver menús",
      buttonClass: "button-secondary",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="text-2xl font-bold mb-2">👋 Bienvenido, Administrador</div>
      <div className="text-color-secondary mb-4">
        Aquí puedes gestionar el sistema y acceder a funciones administrativas.
      </div>

      <div className="grid grid-nogutter md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section, index) => (
          <Card key={index} className="dashboard-card">
            <div className="text-xl font-semibold mb-2 flex items-center gap-2">
              <i className={section.icon}></i>
              {section.title}
            </div>
            <p className="mb-4 text-sm text-color-secondary">
              {section.description}
            </p>
            <Button
              label={section.buttonLabel}
              className={section.buttonClass}
              onClick={() => router.push(section.path)}
              icon={section.icon}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
