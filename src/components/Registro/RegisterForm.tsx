"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import axios from "axios";
import FormInput from "./FormInput";
import PasswordStrength from "./PasswordStrength";
import "@/styles/auth.css";

// 📌 Esquema de validación con Zod
const registerSchema = z.object({
  username: z.string().min(3, "Nombre de usuario muy corto"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Mínimo 6 caracteres"),
  firstName: z.string().min(2, "Nombre muy corto"),
  lastName: z.string().min(2, "Apellido muy corto"),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// ✅ Tipo generado automáticamente desde Zod
type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const { confirmPassword, ...userData } = data;

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, userData);

      toast.current?.show({
        severity: "success",
        summary: "Registro Exitoso",
        detail: "Tu cuenta ha sido creada correctamente.",
        life: 3000,
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 409) {
          if (data.message?.includes("username")) {
            setError("username", { type: "manual", message: "Usuario ya en uso" });
          }
          if (data.message?.includes("email")) {
            setError("email", { type: "manual", message: "Correo ya en uso" });
          }

          toast.current?.show({
            severity: "error",
            summary: "Error de Registro",
            detail: "El usuario o correo ya está en uso.",
            life: 4000,
          });
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error inesperado",
            detail: data.message || "Intenta de nuevo.",
            life: 4000,
          });
        }
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error en el registro",
          detail: "Intenta de nuevo más tarde.",
          life: 4000,
        });
      }
    }
  };

  return (
    <div className="auth-container">
      <Toast ref={toast} />
      <div className="auth-card">
        <h2 className="auth-title">Registro</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="form-grid">
            {/* Usuario y Correo */}
            <FormInput name="username" label="Nombre de Usuario" control={control} errors={errors} required />
            <FormInput name="email" label="Correo Electrónico" type="email" control={control} errors={errors} required />

            {/* Nombre y Apellido */}
            <FormInput name="firstName" label="Nombre" control={control} errors={errors} required />
            <FormInput name="lastName" label="Apellido" control={control} errors={errors} required />

            {/* Teléfono */}
            <div className="centered-half-width">
              <FormInput name="phone" label="Teléfono" control={control} errors={errors} />
            </div>

            {/* Contraseñas */}
            <FormInput name="password" label="Contraseña" type="password" control={control} errors={errors} required />
            <FormInput name="confirmPassword" label="Confirmar Contraseña" type="password" control={control} errors={errors} required />

            {/* Fortaleza */}
            <div className="full-width">
              <PasswordStrength password={password} />
            </div>

            {/* Botón */}
            <div className="centered-half-width">
              <Button
                label="Registrarse"
                type="submit"
                className="auth-button p-button-success mt-3"
                loading={isSubmitting}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
