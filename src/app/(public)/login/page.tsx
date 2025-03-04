"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const result = await signIn("credentials", {
      usernameOrEmail,
      password,
      redirect: false,
    });

    if (result?.error) {
      alert("Error de autenticación: Verifica tus credenciales");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>
        <div className="mb-4">
          <label>Usuario o Email</label>
          <InputText
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label>Contraseña</label>
          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            feedback={false}
            className="w-full"
          />
        </div>
        <Button label="Ingresar" onClick={handleLogin} className="w-full" />
      </div>
    </div>
  );
}
