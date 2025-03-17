"use client";
import React, { useState } from "react";
import axios from "axios";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleRecuperar = async () => {
    try {
      // Endpoint de tu backend
      const resp = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        email
      });
      setMsg("Si el correo existe, se ha enviado un enlace de recuperación.");
    } catch (error) {
      setMsg("Error en la recuperación. Intenta más tarde.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h1>Recuperar Contraseña</h1>
      <input
        type="email"
        placeholder="Ingresa tu correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleRecuperar}>Recuperar</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
