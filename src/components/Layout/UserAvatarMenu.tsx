"use client";

import React, { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

export default function UserAvatarMenu() {
  const { user, handleLogout } = useAuth();
  const opRef = useRef<OverlayPanel>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("[UserAvatarMenu] Se renderiza => user:", user);
  }, [user]);

  return (
    <>
      {/* Panel flotante de usuario */}
      <OverlayPanel
        ref={opRef}
        dismissable
        showCloseIcon
        className="user-overlay-panel"
      >
        {user ? (
          <div className="flex flex-column align-items-center gap-2">
            <div className="text-2xl font-bold flex align-items-center gap-2">
              <span role="img" aria-label="saludo">
                👋
              </span>{" "}
              {user.username}
            </div>
            <span className="text-sm text-color-secondary">{user.email}</span>
            <span className="text-sm text-color-secondary">
              Rol: {user.role}
            </span>

            {/* Acciones */}
            <div className="flex flex-column gap-2 mt-3 w-full">
              <Button
                icon="pi pi-user"
                label="Perfil"
                className="w-full"
                text
                onClick={() => {
                  console.log("[UserAvatarMenu] Ir a /perfil");
                  router.push("/perfil");
                  opRef.current?.hide();
                }}
              />
              <Button
                icon="pi pi-sign-out"
                label="Cerrar sesión"
                className="w-full"
                severity="danger"
                text
                onClick={async () => {
                  console.log("[UserAvatarMenu] handleLogout()");
                  await handleLogout();
                  opRef.current?.hide();
                }}
              />
            </div>
          </div>
        ) : (
          <div className="text-sm text-color-secondary text-center">
            No autenticado
          </div>
        )}
      </OverlayPanel>

      {/* Avatar clickable */}
      <Avatar
        icon="pi pi-user"
        shape="circle"
        className="user-avatar"
        size="large"
        onClick={(e) => {
          console.log("[UserAvatarMenu] click avatar => opRef.toggle");
          opRef.current?.toggle(e);
        }}
      />
    </>
  );
}
