import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;

    const isLoginPage =
      pathname === "/login" || pathname === "/(public)/login";

    const isAuthenticated = !!req.nextauth.token;

    // 🔁 Previene acceso al login si ya está autenticado
    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // ✅ Continuar con la petición
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        // Solo permite acceso a rutas protegidas si hay sesión activa
        return !!token;
      },
    },
    pages: {
      signIn: "/login", // Ruta pública
    },
  }
);

// ✅ Aplica solo a rutas privadas, no repliques en login
export const config = {
  matcher: ["/(protected)/:path*"], // 👈 evitamos que se aplique a login
};
