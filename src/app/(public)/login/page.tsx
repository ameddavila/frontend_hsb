"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Link from "next/link";

import "@/styles/auth.css"; // Importar estilos globales

// Esquema de validación con Zod
const loginSchema = z.object({
  usernameOrEmail: z.string().min(3, "Campo obligatorio"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

interface LoginFormInputs {
  usernameOrEmail: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [loginError, setLoginError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { usernameOrEmail: "", password: "" },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoginError("");

    const result = await signIn("credentials", {
      usernameOrEmail: data.usernameOrEmail,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setLoginError("Credenciales incorrectas. Intenta de nuevo.");
      toast.current?.show({
        severity: "error",
        summary: "Error de autenticación",
        detail: "Credenciales incorrectas. Intenta de nuevo.",
        life: 4000,
      });
    } else {
      toast.current?.show({
        severity: "success",
        summary: "Inicio de sesión exitoso",
        detail: "Bienvenido de nuevo.",
        life: 3000,
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  };

  return (
    <div className="auth-container">
      <Toast ref={toast} />
      <div className="auth-card">
        <h2 className="auth-title">Iniciar Sesión</h2>

        {loginError && <div className="auth-error">{loginError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="form-grid login">
            <div className="full-width">
              <Controller
                name="usernameOrEmail"
                control={control}
                render={({ field }) => (
                  <div className="p-field">
                    <label htmlFor="usernameOrEmail">Correo Electrónico o Usuario</label>
                    <InputText {...field} id="usernameOrEmail" aria-label="Correo Electrónico o Usuario" />
                  </div>
                )}
              />
              {errors.usernameOrEmail && (
                <small className="p-error">{errors.usernameOrEmail.message}</small>
              )}
            </div>

            <div className="full-width">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div className="p-field">
                    <label htmlFor="password">Contraseña</label>
                    <Password {...field} id="password" toggleMask feedback={false} aria-label="Contraseña" />
                  </div>
                )}
              />
              {errors.password && <small className="p-error">{errors.password.message}</small>}
            </div>

            {/* Botón de envío */}
            <div className="full-width">
              <Button
                label="Ingresar"
                type="submit"
                className="auth-button p-button-primary mt-3"
                loading={isSubmitting}
              />
            </div>
          </div>
        </form>

        {/* Sección de enlaces */}
        <div className="auth-links">
          <p>
            ¿No tienes cuenta? <Link href="/register">Regístrate</Link>
          </p>
          <p>
            ¿Olvidaste tu contraseña? <Link href="/recover">Recuperar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
