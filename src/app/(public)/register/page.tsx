"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { registerUser } from "@/services/auth";
import Link from "next/link";

import "@/styles/globals.css";
import "@/styles/auth.css";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await registerUser(formData);
      alert("Registro exitoso");
      router.push("/login");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Sección Izquierda (Logo) */}
      <div className="auth-left">
        <h1 className="logo-text">Chappie</h1>
        <div className="logo-brain"></div>
      </div>

      {/* Sección Derecha (Formulario) */}
      <div className="auth-right">
        <h2 className="register-title">Registro de Usuario</h2>

        <div className="p-field">
          <span className="p-float-label">
            <InputText
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="p-inputtext w-full"
            />
            <label htmlFor="username">Nombre de Usuario</label>
          </span>
        </div>

        <div className="p-field">
          <span className="p-float-label">
            <InputText
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-inputtext w-full"
            />
            <label htmlFor="email">Correo Electrónico</label>
          </span>
        </div>

        <div className="p-field">
          <span className="p-float-label">
            <Password
              name="password"
              value={formData.password}
              onChange={handleChange}
              toggleMask
              feedback={false}
              className="p-inputtext w-full"
            />
            <label htmlFor="password">Contraseña</label>
          </span>
        </div>

        <div className="p-field">
          <span className="p-float-label">
            <InputText
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="p-inputtext w-full"
            />
            <label htmlFor="firstName">Nombre</label>
          </span>
        </div>

        <div className="p-field">
          <span className="p-float-label">
            <InputText
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="p-inputtext w-full"
            />
            <label htmlFor="lastName">Apellido</label>
          </span>
        </div>

        <div className="p-field">
          <span className="p-float-label">
            <InputText
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="p-inputtext w-full"
            />
            <label htmlFor="phone">Teléfono</label>
          </span>
        </div>

        {/* Botón de Registro */}
        <Button
          label="Registrarse"
          onClick={handleSubmit}
          className="register-button"
          loading={loading}
        />

        {/* Enlace a Iniciar Sesión */}
        <div className="links">
          <Link href="/login">
            ¿Ya tienes cuenta? <strong>Inicia Sesión</strong>
          </Link>
        </div>
      </div>
    </div>
  );
}
