"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import Link from "next/link";  // <--- Importar Link de Next
import { useState } from "react";

import "@/styles/auth.css";

// Esquema de validación
const loginSchema = z.object({
  usernameOrEmail: z.string().min(3, "Campo obligatorio"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  // (Opcional) deviceId: z.string().default("MiLaptop-Windows") // Ejemplo
});

interface LoginFormInputs {
  usernameOrEmail: string;
  password: string;
  // deviceId?: string; // si quieres un campo en el formulario
}

export default function LoginPage() {
  const router = useRouter();
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

    // Ejemplo: añadir deviceId "dinámico" 
    // (en la práctica, podría venir de un hook que obtiene info del SO, etc.)
    const deviceId = "MiLaptop-Windows";

    // signIn con Provider "credentials"
    const result = await signIn("credentials", {
      usernameOrEmail: data.usernameOrEmail,
      password: data.password,
      // deviceId,  // si tu backend lo procesa en /auth/login
      redirect: false,
    });

    if (result?.error) {
      setLoginError("Credenciales incorrectas. Intenta de nuevo.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Iniciar Sesión</h2>

        {loginError && <div className="auth-error">{loginError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="p-field">
            <label>Correo Electrónico</label>
            <Controller
              name="usernameOrEmail"
              control={control}
              render={({ field }) => <InputText {...field} />}
            />
            {errors.usernameOrEmail && (
              <small className="p-error">
                {errors.usernameOrEmail.message}
              </small>
            )}
          </div>

          <div className="p-field">
            <label>Contraseña</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Password {...field} toggleMask feedback={false} />
              )}
            />
            {errors.password && (
              <small className="p-error">{errors.password.message}</small>
            )}
          </div>

          {/* Botón para Enviar */}
          <Button
            label="Ingresar"
            type="submit"
            className="auth-button p-button-primary mt-3"
            loading={isSubmitting}
          />

          {/* Sección de enlaces (Registro y Recuperar contraseña) */}
          <div className="auth-links" style={{ marginTop: "1rem", textAlign: "center" }}>
            <p>
              ¿No tienes cuenta?{" "}
              <Link href="/register" style={{ color: "#007bff" }}>
                Regístrate
              </Link>
            </p>
            <p>
              ¿Olvidaste tu contraseña?{" "}
              <Link href="/recuperar" style={{ color: "#007bff" }}>
                Recuperar
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
