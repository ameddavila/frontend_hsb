"use client";

export default function Footer() {
  return (
    <footer
      className="flex justify-content-center align-items-center py-2"
      style={{
        backgroundColor: "var(--color-bg-footer)",
        color: "var(--color-text-white)"
      }}
>

      <p className="m-0">
        © {new Date().getFullYear()} Hospital Santa Bárbara - Todos los derechos reservados
      </p>
    </footer>
  );
}
