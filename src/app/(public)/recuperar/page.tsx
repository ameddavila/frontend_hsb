"use client";
import React, { useState } from "react";
import axios from "axios";
import "@/styles/auth.css"; // Importamos los estilos de autenticación

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleRecuperar = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, { email });
      setMsg("Si el correo existe, se ha enviado un enlace de recuperación.");
    } catch (error) {
      console.error("Error en la recuperación:", error);
      setMsg("Error en la recuperación. Intenta más tarde.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Recuperar Contraseña</h2>
        
        <input
          type="email"
          placeholder="Ingresa tu correo"
          className="p-inputtext"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <button className="auth-button auth-button-primary" onClick={handleRecuperar}>
          Recuperar
        </button>

        {msg && <p className="auth-msg">{msg}</p>}
      </div>
    </div>
  );
}
