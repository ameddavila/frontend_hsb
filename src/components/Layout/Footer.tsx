// ✅ Footer limpio, responsivo y coherente con la paleta global
"use client";

export default function Footer() {
  return (
    <footer className="flex justify-content-center align-items-center py-3 surface-300 text-white text-sm mt-auto">
      <p className="m-0 text-center">
        © {new Date().getFullYear()} Hospital Santa Bárbara – Todos los derechos reservados
      </p>
    </footer>
  );
}