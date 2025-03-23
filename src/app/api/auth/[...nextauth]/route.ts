// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

type BackendUser = {
  id: string;
  role: string;
  username: string;
  email: string;
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
          if (!credentials) throw new Error("Credenciales no proporcionadas");

          const response = await axios.post<BackendUser>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              usernameOrEmail: credentials.usernameOrEmail,
              password: credentials.password,
            },
            { withCredentials: true }
          );

          const user = response.data;

          if (!user || !user.id || !user.role) return null;

          return {
            id: user.id,
            role: user.role,
            name: user.username,
            email: user.email,
          };
        } catch (error) {
          console.error("❌ Error en autenticación:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
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
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
