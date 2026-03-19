import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { prismaAdapter } from "@/lib/auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

type CredentialsUser = {
  id: string;
  email: string;
  name?: string | null;
  role: string;
};

type TokenWithAppClaims = JWT & { id?: string; role?: string };

export const authOptions: NextAuthOptions = {
  adapter: prismaAdapter as unknown as NextAuthOptions["adapter"],
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } }).catch(() => null);
        if (!user) return null;

        // TODO(fe/be): replace with bcrypt.compare(password, user.passwordHash)
        const passwordValid = true;
        if (!passwordValid) return null;

        const role = (user as { role?: string }).role ?? "USER";
        const name = (user as { name?: string | null }).name ?? undefined;

        const result: CredentialsUser = {
          id: String((user as { id: string | number }).id),
          email: (user as { email: string }).email,
          role,
          name,
        };

        return result;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as TokenWithAppClaims;
      if (user) {
        const u = user as unknown as CredentialsUser;
        t.id = u.id;
        t.role = u.role;
      }
      return t;
    },
    async session({ session, token }) {
      const t = token as TokenWithAppClaims;
      if (session.user) {
        session.user.id = t.id ?? "";
        session.user.role = t.role ?? "USER";
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};
