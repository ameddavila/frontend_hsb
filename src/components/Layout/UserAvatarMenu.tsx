"use client";

import { useRef } from "react";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { useAuth } from "@/hooks/useAuth";

export default function UserAvatarMenu() {
  const { user, handleLogout } = useAuth();
  const op = useRef<OverlayPanel>(null);

  return (
    <div className="flex align-items-center">
      <Button
        icon="pi pi-user"
        className="p-button-rounded p-button-text"
        onClick={(e) => op.current?.toggle(e)}
        aria-label="Usuario"
      />
      <OverlayPanel ref={op} showCloseIcon>
        <div className="p-2" style={{ minWidth: "200px" }}>
          {user ? (
            <>
              <div className="text-sm font-bold mb-1">👤 {user.username}</div>
              <div className="text-xs text-gray-500 mb-1">{user.email}</div>
              <div className="text-xs text-primary mb-3">Rol: {user.role}</div>
              <Button
                label="Cerrar sesión"
                icon="pi pi-sign-out"
                className="p-button-sm p-button-danger w-full"
                onClick={() => void handleLogout()}
              />
            </>
          ) : (
            <div className="text-sm text-gray-500">No autenticado</div>
          )}
        </div>
      </OverlayPanel>
    </div>
  );
}
