import NextAuth, { NextAuthOptions, User, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { JWT } from "next-auth/jwt";
import { parse } from "cookie";

// 🔹 Definir `CustomUser` extendiendo `User`
interface CustomUser extends User {
  id: string;
  roleId: number;
  roleName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}
// 🔹 Extender el tipo `Session` para incluir `roleId` y `roleName`
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      roleId?: number;
      roleName?: string;
      accessToken?: string;
      refreshToken?: string;
    };
    error?: string;
  }
}

// 🔹 Función para decodificar JWT
function decodeJWT(token: string) {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  } catch (error) {
    console.error("Error decodificando JWT:", error);
    return null;
  }
}

// 🔹 Función para renovar el `accessToken`
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );

    const cookies = response.headers["set-cookie"];
    if (!cookies) throw new Error("No se recibieron cookies con nuevos tokens");

    const parsedCookies = parse(cookies.join("; "));
    const newAccessToken = parsedCookies.accessToken;
    const newRefreshToken = parsedCookies.refreshToken;

    if (!newAccessToken || !newRefreshToken) {
      throw new Error("No se encontraron nuevos tokens en las cookies");
    }

    const decodedToken = decodeJWT(newAccessToken);
    if (!decodedToken)
      throw new Error("No se pudo decodificar el nuevo accessToken");

    return {
      ...token,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires: decodedToken.exp * 1000,
      id: decodedToken.userId,
      roleId: decodedToken.roleId,
      roleName: decodedToken.roleName,
    };
  } catch (error) {
    console.error("Error refrescando token:", error);
    return { ...token, error: "RefreshTokenError" };
  }
}

// 🔹 Configuración de NextAuth
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrEmail: { label: "Usuario o Email", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        try {
          if (!credentials) throw new Error("Credenciales no proporcionadas");

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              usernameOrEmail: credentials.usernameOrEmail,
              password: credentials.password,
            },
            { withCredentials: true }
          );

          const cookies = response.headers["set-cookie"];
          if (!cookies) throw new Error("No se recibieron cookies con tokens");

          const parsedCookies = parse(cookies.join("; "));
          const accessToken = parsedCookies.accessToken;
          const refreshToken = parsedCookies.refreshToken;

          if (!accessToken || !refreshToken)
            throw new Error("Faltan tokens en las cookies");

          const decodedToken = decodeJWT(accessToken);
          if (!decodedToken)
            throw new Error("No se pudo decodificar el accessToken");

          return {
            id: decodedToken.userId,
            roleId: decodedToken.roleId,
            roleName: decodedToken.roleName,
            role: decodedToken.roleName, // 🔹 Agrega esto
            accessToken: accessToken,
            refreshToken: refreshToken,
          } as CustomUser;
        } catch (error) {
          console.error("Error en autenticación:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("🟢 JWT Callback ejecutado. Token antes:", token);
      if (user) {
        return {
          ...token,
          id: user.id,
          roleId: (user as CustomUser).roleId, // 🔹 TypeScript ahora reconocerá `roleId`
          roleName: (user as CustomUser).roleName,
          role: (user as CustomUser).role,
          accessToken: (user as CustomUser).accessToken,
          refreshToken: (user as CustomUser).refreshToken, // 🔹 Ahora TypeScript lo reconoce
          accessTokenExpires: Date.now() + 15 * 60 * 1000, // Expira en 15 min
        };
      }

      // 🔄 Si el accessToken ha expirado, intenta refrescarlo
      if (Date.now() > (token.accessTokenExpires as number)) {
        const newToken = await refreshAccessToken(token);

        if (newToken.error) {
          console.warn("🔴 RefreshTokenError detectado. Cerrando sesión...");
          return { error: "RefreshTokenError" };
        }

        return newToken;
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        id: token.id as string,
        role: token.role as string, // ✅ NextAuth usa `role`
        roleId: token.roleId ? (token.roleId as number) : undefined,
        roleName: token.roleName ? (token.roleName as string) : undefined,
        accessToken: token.accessToken
          ? (token.accessToken as string)
          : undefined,
        refreshToken: token.refreshToken
          ? (token.refreshToken as string)
          : undefined,
      };

      if (token.error) {
        session.error = token.error as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
