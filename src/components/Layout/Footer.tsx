"use client";

export default function Footer() {
  return (
    <footer className="flex justify-content-center align-items-center py-2 bg-dark text-white">
      <p className="m-0">
        © {new Date().getFullYear()} SISHSB - Todos los derechos reservados
      </p>
    </footer>
  );
}
