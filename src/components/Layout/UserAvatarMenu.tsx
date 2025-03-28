"use client";

import { useAuth } from "@/context/AuthContext";
import { Menu } from "primereact/menu";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { OverlayPanel } from "primereact/overlaypanel";

export default function UserAvatarMenu() {
  const { user, handleLogout } = useAuth();
  const menuRef = useRef<Menu>(null);
  const opRef = useRef<OverlayPanel>(null);
  const router = useRouter();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // si quieres futura imagen

  const menuItems = [
    {
      label: "Perfil",
      icon: "pi pi-user",
      command: () => router.push("/perfil"),
    },
    {
      separator: true,
    },
    {
      label: "Cerrar sesión",
      icon: "pi pi-sign-out",
      command: async () => {
        await handleLogout();
      },
    },
  ];

  return (
    <>
      <OverlayPanel
        ref={opRef}
        dismissable
        showCloseIcon
        className="shadow-4 border-round-md p-3 surface-overlay"
      >
        {user ? (
          <div className="flex flex-column align-items-start gap-2">
            <div className="font-bold text-sm">👋 Hola, {user.username}</div>
            <div className="text-xs text-color-secondary">{user.email}</div>
            <div className="text-xs text-color-secondary mb-2">Rol: {user.role}</div>
            <Button
              icon="pi pi-user"
              label="Perfil"
              text
              size="small"
              onClick={() => {
                router.push("/perfil");
                opRef.current?.hide();
              }}
            />
            <Button
              icon="pi pi-sign-out"
              label="Cerrar sesión"
              severity="danger"
              text
              size="small"
              onClick={async () => {
                await handleLogout();
                opRef.current?.hide();
              }}
            />
          </div>
        ) : (
          <div className="text-sm text-color-secondary">No autenticado</div>
        )}
      </OverlayPanel>

      <Avatar
        icon={!avatarUrl ? "pi pi-user" : undefined}
        image={avatarUrl || undefined}
        shape="circle"
        className="cursor-pointer border-2 border-primary"
        size="large"
        onClick={(e) => opRef.current?.toggle(e)}
      />
    </>
  );
}
