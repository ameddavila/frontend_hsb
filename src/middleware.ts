// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/activar-cuenta"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  const accessToken = req.cookies.get("accessToken")?.value;

  // 🔐 Si no hay token y no es ruta pública, redirigir a login
  if (!accessToken && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Si ya tienes token y vas a /login, redirigir a dashboard
  if (accessToken && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ✅ Permitir continuar
  return NextResponse.next();
}

// ✅ Configuración de rutas protegidas
export const config = {
  matcher: ["/", "/dashboard", "/protected/:path*", "/login"],
};

