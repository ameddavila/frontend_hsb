"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Link from "next/link";
import "@/styles/auth.css";

const loginSchema = z.object({
  usernameOrEmail: z.string().min(3, "Campo obligatorio"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

interface LoginFormInputs {
  usernameOrEmail: string;
  password: string;
}

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    console.log("🔍 useSession() status:", status);
    console.log("🔍 useSession() session:", session);

    if (status === "authenticated") {
      console.log("✅ Usuario ya autenticado. Redirigiendo al dashboard...");
      router.push("/dashboard");
    }
  }, [status, session, router]);

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
    setLoginError("");

    console.log("🚀 Enviando credenciales:", data);

    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    console.log("🧠 Resultado del signIn:", result);

    if (result?.error === "usuario_inactivo") {
      console.log("⚠️ Usuario inactivo. Redirigiendo a /activar-cuenta");
      router.push("/activar-cuenta");
      return;
    }

    if (result?.error) {
      setLoginError("Credenciales incorrectas o error en la autenticación.");
      console.log("❌ Error en login:", result.error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: loginError,
        life: 3000,
      });
      return;
    }

    console.log("✅ Login exitoso. Redirigiendo a dashboard...");
    router.push("/dashboard");
  };

  if (status === "loading") return <p>Cargando sesión...</p>;

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
                    <Password {...field} toggleMask feedback={false} />
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
