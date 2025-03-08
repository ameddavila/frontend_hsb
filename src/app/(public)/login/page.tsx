"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import Link from "next/link";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "@/styles/auth.css"; // Estilos personalizados

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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
    <div className="auth-container">
      <div className="auth-card grid">
        {/* Sección Izquierda con Logo */}
        <div className="col-5 auth-left">
          <h1 className="logo-text">Chappie</h1>
          <div className="brain-icon">
            <i className="pi pi-cog"></i>
          </div>
        </div>

        {/* Sección Derecha con Formulario */}
        <div className="col-7 auth-right">
          <h2 className="auth-title">Iniciar Sesión</h2>

          <div className="p-field">
            <span className="p-float-label">
              <InputText
                id="usernameOrEmail"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="p-inputtext w-full"
              />
              <label htmlFor="usernameOrEmail">Correo Electrónico</label>
            </span>
          </div>

          <div className="p-field">
            <span className="p-float-label">
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                toggleMask
                feedback={false}
                className="p-inputtext w-full"
              />
              <label htmlFor="password">Contraseña</label>
            </span>
          </div>

          {/* Recuérdame */}
          <div className="remember-me flex align-items-center">
            <Checkbox
              inputId="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.checked!)}
            />
            <label htmlFor="rememberMe" className="ml-2">
              Recuérdame
            </label>
          </div>

          {/* Botón de Login */}
          <Button
            label="Iniciar Sesión"
            onClick={handleLogin}
            className="login-button"
          />

          {/* Enlaces de Registro y Recuperación */}
          <div className="links">
            <Link href="/register">Regístrate aquí</Link>
            <Link href="/forgot-password">Recuperar Contraseña</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
