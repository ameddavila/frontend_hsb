// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

type BackendUser = {
  id: string;
  role: string;
  username: string;
  email: string;
  estado?: string; // activo | inactivo
};

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrEmail: { label: "Usuario o Email", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("📩 Credentials recibidas:", credentials);
          if (!credentials?.usernameOrEmail || !credentials?.password) {
            throw new Error("Credenciales incompletas");
          }

          const response = await axios.post<BackendUser>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              usernameOrEmail: credentials.usernameOrEmail,
              password: credentials.password,
            },
            { withCredentials: true }
          );

          const user = response.data;
          console.log("✅ Usuario recibido del backend:", user);

          if (!user || !user.id || !user.role) return null;

          if (user.estado && user.estado !== "activo") {
            console.log("⛔ Usuario inactivo detectado");
            throw new Error("usuario_inactivo");
          }

          return {
            id: String(user.id),
            role: user.role,
            name: user.username,
            email: user.email,
          };
        } catch (error: any) {
          console.error("❌ Error en authorize:", error?.message);
          const mensaje = error?.message || error?.response?.data?.message;
          if (mensaje === "usuario_inactivo") {
            // Transmitimos el error al frontend
            throw new Error("usuario_inactivo");
          }

          console.error("❌ Error en authorize:", mensaje);
          throw new Error("error_autenticacion");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 horas
  },
  jwt: {
    maxAge: 60 * 60 * 8, // 8 horas
  },
  

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login", // Usamos /login para manejar errores
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
