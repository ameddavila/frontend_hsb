"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Link from "next/link";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const toast = useRef<Toast>(null);

  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, { email });

      toast.current?.show({
        severity: "success",
        summary: "Correo enviado",
        detail: "Si el correo existe, se ha enviado un enlace de recuperación.",
        life: 4000,
      });

      setEmail(""); // Limpiar el input tras el envío
    } catch (error) {
      console.error("Error en la recuperación:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error en la recuperación. Intenta más tarde.",
        life: 4000,
      });
    }
  };

  return (
    <div className="auth-container">
      <Toast ref={toast} />
      <div className="auth-card">
        <h2 className="auth-title">Recuperar Contraseña</h2>
        
        <form onSubmit={handleRecuperar} className="p-fluid">
          <div className="form-grid recover">
            <div className="full-width">
              <label>Correo Electrónico</label>
              <InputText 
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="full-width">
              <Button label="Recuperar" type="submit" className="auth-button p-button-primary mt-3" />
            </div>
          </div>
        </form>

        <div className="auth-links">
          <p>
            <Link href="/login">Volver al inicio de sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
