"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "primereact/button";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="navbar">
      <h1 className="text-xl font-bold">SISHSB</h1>
      {session?.user && (
        <div className="flex align-items-center gap-3">
          <span>{session.user.roleName}</span>
          <Button
            label="Salir"
            onClick={() => signOut()}
            className="button-primary"
          />
        </div>
      )}
    </nav>
  );
}
