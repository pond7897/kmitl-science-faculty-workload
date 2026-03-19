import type { NextAuthOptions } from "next-auth";

// NOTE(front-end only): backend will add Prisma client + adapter wiring.
// We keep an adapter symbol for imports, but leave it undefined.
export const prismaAdapter = undefined as unknown as NextAuthOptions["adapter"];
