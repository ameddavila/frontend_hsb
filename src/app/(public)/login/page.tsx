"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useState } from "react";

import "@/styles/auth.css";

// 📌 Definir el esquema de validación con Zod
const loginSchema = z.object({
  usernameOrEmail: z.string().min(3, "Campo obligatorio"),
  password: z.string().min(3, "Mínimo 6 caracteres"),
});

// 📌 Definir la interfaz para evitar `any`
interface LoginFormInputs {
  usernameOrEmail: string;
  password: string;
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

    const result = await signIn("credentials", {
      usernameOrEmail: data.usernameOrEmail,
      password: data.password,
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

          <Button
            label="Ingresar"
            type="submit"
            className="auth-button p-button-primary mt-3"
            loading={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
}
