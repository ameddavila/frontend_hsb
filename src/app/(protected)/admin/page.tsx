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
      buttonClass: "p-button-primary",
    },
    {
      title: "Roles",
      description: "Gestiona los roles y permisos del sistema.",
      icon: "pi pi-id-card",
      path: "/admin/roles",
      buttonLabel: "Ver roles",
      buttonClass: "p-button-secondary",
    },
    {
      title: "Permisos",
      description: "Configura los permisos para cada rol.",
      icon: "pi pi-key",
      path: "/admin/permissions",
      buttonLabel: "Ver permisos",
      buttonClass: "p-button-secondary",
    },
    {
      title: "Menús",
      description: "Organiza los menús de navegación del sistema.",
      icon: "pi pi-list",
      path: "/admin/menus",
      buttonLabel: "Ver menús",
      buttonClass: "p-button-secondary",
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-3 text-primary">
        👋 Bienvenido, Administrador
      </h2>
      <p className="text-gray-600 mb-4">
        Aquí puedes gestionar el sistema y acceder a funciones administrativas.
      </p>

      <div className="grid">
        {sections.map((section, index) => (
          <div key={index} className="col-12 md:col-6 lg:col-3">
            <Card className="h-full shadow-2 border-1 surface-border border-round-xl">
              <div className="text-xl font-semibold mb-2 flex align-items-center gap-2 text-primary">
                <i className={section.icon}></i>
                <span>{section.title}</span>
              </div>
              <p className="text-sm text-color-secondary mb-3">
                {section.description}
              </p>
              <Button
                label={section.buttonLabel}
                icon={section.icon}
                className={`${section.buttonClass} p-button-sm w-full`}
                onClick={() => router.push(section.path)}
              />
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
