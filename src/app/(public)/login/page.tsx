"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Link from "next/link";
import { useCsrf } from "@/hooks/useCsrf";
import "@/styles/auth.css";

// 📦 Validación con Zod
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
  const { user, loading, handleLogin } = useAuth();
  useCsrf(); // ✅ CSRF público al cargar

  // Redirección si ya hay sesión
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await handleLogin(data.usernameOrEmail, data.password);
    } catch (err) {
      console.error("❌ Error en login:", err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Credenciales incorrectas o error en la autenticación.",
        life: 3000,
      });
    }
  };

  return (
    <div className="auth-container">
      <Toast ref={toast} />
      <div className="auth-card">
        <h2 className="auth-title">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="form-grid login">
            <div className="full-width">
              <Controller
                name="usernameOrEmail"
                control={control}
                render={({ field }) => (
                  <div className="p-field">
                    <label htmlFor="usernameOrEmail">Correo o Usuario</label>
                    <InputText {...field} id="usernameOrEmail" />
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
                    <Password {...field} toggleMask feedback={false} id="password" />
                  </div>
                )}
              />
              {errors.password && (
                <small className="p-error">{errors.password.message}</small>
              )}
            </div>

            <div className="full-width">
              <Button
                label="Ingresar"
                type="submit"
                loading={isSubmitting}
                className="auth-button p-button-primary mt-3"
              />
            </div>
          </div>
        </form>

        <div className="auth-links">
          <p>¿No tienes cuenta? <Link href="/register">Regístrate</Link></p>
          <p>¿Olvidaste tu contraseña? <Link href="/recover">Recuperar</Link></p>
        </div>
      </div>
    </div>
  );
}
