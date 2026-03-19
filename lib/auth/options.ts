import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// NOTE(front-end only): backend team will wire up DB + Prisma later.
// Keep config compiling by not importing prisma until it exists.

type CredentialsUser = {
  id: string;
  email: string;
  name?: string | null;
  role: string;
};

type TokenWithAppClaims = JWT & { id?: string; role?: string };

export const authOptions: NextAuthOptions = {
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

        // TODO(back-end): validate credentials against real user store + hash.
        // Return a minimal user object for JWT creation.
        return {
          id: email,
          email,
          role: "faculty",
          name: email,
        } satisfies CredentialsUser;
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
        session.user.role = t.role ?? "faculty";
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};
