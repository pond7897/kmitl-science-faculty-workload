import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
  },

  // Cookie configuration for production and development
  trustedOrigins: [
    'http://localhost:3000', 
    'http://localhost:3001',
    'http://9pm.website',
    'https://9pm.website',
  ],
  
  // Advanced session configuration for cross-origin
  advanced: {
    useSecureCookies: false, // Allow cookies over HTTP for development
    cookiePrefix: 'better_auth',
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  
  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
});

export { prisma };

