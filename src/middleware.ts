import { withAuth } from "next-auth/middleware";

// 1. Exportamos el middleware conAuth
export default withAuth({
  pages: {
    // Ruta donde se redirige si no hay sesión:
    signIn: "/login", 
    // O "/(public)/login" si tu URL final es esa
  },
});

// 2. Definir config para especificar a qué rutas aplica
export const config = {
  // Aplica sólo a las rutas de (protected) 
  //   => /dashboard, /profile, etc.
  matcher: ["/(protected)/:path*"],
};
