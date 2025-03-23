import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const isLoginPage =
      pathname === "/login" || pathname === "/(public)/login";

    // ✅ Si está autenticado y está en /login, redirigir a /dashboard
    if (req.nextauth?.token && isLoginPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login", // o "/(public)/login" según tu ruta real
    },
  }
);

// ✅ Define a qué rutas aplicar el middleware
export const config = {
  matcher: ["/(protected)/:path*", "/login", "/(public)/login"],
};
