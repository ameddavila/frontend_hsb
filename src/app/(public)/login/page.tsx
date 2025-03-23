"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { useState, useRef } from "react";
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
  const { status } = useSession();
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [loginError, setLoginError] = useState("");

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

    const result = await signIn("credentials", {
      ...data,
      callbackUrl: "/dashboard", // redirige directamente
      redirect: true,
    });

    if (result?.error) {
      setLoginError("Credenciales incorrectas. Intenta de nuevo.");
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: loginError,
        life: 3000,
      });
    }
  };

  if (status === "loading") return null;
  if (status === "authenticated") {
    router.replace("/dashboard");
    return null;
  }

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
                <small className="p-error">
                  {errors.usernameOrEmail.message}
                </small>
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
