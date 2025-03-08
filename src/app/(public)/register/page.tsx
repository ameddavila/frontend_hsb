"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import axios from "axios";

import "@/styles/auth.css";

// 📌 Esquema de validación con Zod
const registerSchema = z
  .object({
    username: z.string().min(3, "Mínimo 3 caracteres"),
    email: z.string().email("Correo inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Mínimo 6 caracteres"),
    firstName: z.string().min(2, "Mínimo 2 caracteres"),
    lastName: z.string().min(2, "Mínimo 2 caracteres"),
    phone: z.string().min(6, "Número inválido").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// 📌 Definir la interfaz para el formulario
interface RegisterFormInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError, // 📌 `setError` se mantiene para manejar errores de backend
    formState: { isSubmitting },
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

  // 📌 Especificamos el tipo correcto en `onSubmit`
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        {
          username: data.username,
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        }
      );

      console.log("✅ Registro exitoso:", response.data);
      alert("Registro exitoso");
      router.push("/login");
    } catch (error) {
      // 📌 Tipado correcto para errores del backend
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          setError("username", {
            type: "manual",
            message: "Usuario ya en uso",
          });
          setError("email", { type: "manual", message: "Correo ya en uso" });
        } else if (error.response.status === 400) {
          setError("email", {
            type: "manual",
            message: error.response.data.message,
          });
        } else {
          alert(
            `Error desconocido: ${
              error.response.data.message || "Intenta de nuevo."
            }`
          );
        }
      } else {
        alert("Error en el registro. Intenta de nuevo.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Registro</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="form-grid">
            <div className="p-field">
              <label>Nombre de Usuario</label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => <InputText {...field} />}
              />
            </div>

            <div className="p-field">
              <label>Correo Electrónico</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => <InputText {...field} />}
              />
            </div>

            <div className="p-field">
              <label>Nombre</label>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => <InputText {...field} />}
              />
            </div>

            <div className="p-field">
              <label>Apellido</label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => <InputText {...field} />}
              />
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
            </div>

            <div className="p-field">
              <label>Confirmar Contraseña</label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Password {...field} toggleMask feedback={false} />
                )}
              />
            </div>

            <div className="p-field">
              <label>Teléfono</label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => <InputText {...field} />}
              />
            </div>
          </div>

          <Button
            label="Registrarse"
            type="submit"
            className="auth-button p-button-success mt-3"
            loading={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
}
