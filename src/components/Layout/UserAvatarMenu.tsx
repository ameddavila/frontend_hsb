// ✅ UserAvatarMenu mejorado: limpio, accesible, estilizado
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
    console.log("[UserAvatarMenu] user:", user);
  }, [user]);

  const handlePerfil = () => {
    router.push("/perfil");
    opRef.current?.hide();
  };

  const handleCerrarSesion = async () => {
    await handleLogout();
    opRef.current?.hide();
  };

  return (
    <>
      <OverlayPanel
        ref={opRef}
        dismissable
        showCloseIcon
        className="user-overlay-panel"
      >
        {user ? (
          <div className="flex flex-column align-items-center gap-2 text-center">
            <div className="text-2xl font-semibold">👋 {user.username}</div>
            <span className="text-sm text-color-secondary">{user.email}</span>
            <span className="text-sm text-color-secondary">Rol: {user.role}</span>

            <div className="flex flex-column gap-2 mt-3 w-full">
              <Button
                icon="pi pi-user"
                label="Perfil"
                className="w-full"
                text
                onClick={handlePerfil}
              />
              <Button
                icon="pi pi-sign-out"
                label="Cerrar sesión"
                className="w-full"
                severity="danger"
                text
                onClick={handleCerrarSesion}
              />
            </div>
          </div>
        ) : (
          <div className="text-sm text-color-secondary text-center">No autenticado</div>
        )}
      </OverlayPanel>

      <Avatar
        icon="pi pi-user"
        shape="circle"
        className="user-avatar"
        size="large"
        onClick={(e) => opRef.current?.toggle(e)}
        aria-label="Menú de usuario"
      />
    </>
  );
}