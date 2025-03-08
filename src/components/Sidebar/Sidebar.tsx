"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { label: "Inicio", icon: "pi pi-home", path: "/" },
    { label: "Mi perfil", icon: "pi pi-user", path: "/profile" },
    { label: "Transferencias", icon: "pi pi-money-bill", path: "/transfers" },
    { label: "Servicios", icon: "pi pi-credit-card", path: "/services" },
  ];

  return (
    <div className={classNames("sidebar", { "w-64": isOpen, "w-20": !isOpen })}>
      {/* Botón para abrir/cerrar */}
      <div className="flex justify-between items-center p-4">
        {isOpen && <span className="text-lg font-bold">Menú</span>}
        <Button
          icon={isOpen ? "pi pi-angle-left" : "pi pi-angle-right"}
          className="p-button-text text-white"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* Menú */}
      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="flex items-center p-3 hover:bg-blue-600 cursor-pointer"
          >
            <i className={classNames(item.icon, "mr-3")} />
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
