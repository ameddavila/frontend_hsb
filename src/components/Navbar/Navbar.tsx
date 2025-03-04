"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "primereact/button";

export default function Navbar() {
  const { data: session } = useSession();

  // 🔹 Corregir el error `session.error`
  if (session?.user && "error" in session) {
    signOut(); // 🔹 Cierra sesión si el Refresh Token falló
  }

  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between">
      <h1 className="text-lg font-bold">SISHSB</h1>
      {session?.user ? (
        <div>
          <span>{session.user.roleName}</span>
          <Button
            label="Salir"
            onClick={() => signOut()}
            className="ml-4 p-button-danger"
          />
        </div>
      ) : null}
    </nav>
  );
}
