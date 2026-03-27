import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { dash } from '@better-auth/infra';
import { admin } from 'better-auth/plugins';

// auth.ts
export const auth = betterAuth({
  appName: "Kmitl Workload",
  baseURL: process.env.BETTER_AUTH_BASE_URL!,
  secret: process.env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: { enabled: true },

  trustedOrigins: [
    'https://9pm.website',
    'https://www.9pm.website',
    'http://localhost:3003',
    'http://localhost:3000',
  ],

  advanced: {
    useSecureCookies: true,
    ipAddress: {
      ipAddressHeaders: ['x-forwarded-for', 'x-real-ip', 'cf-connecting-ip'],
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    storeSessionInDatabase: true,
    deferSessionRefresh: true,
  },

  user: {
    additionalFields: {
      firstname_th: { type: 'string' },
      lastname_th: { type: 'string' },
      firstname_en: { type: 'string' },
      lastname_en: { type: 'string' },
      iamId: { type: 'string' },
    },
  },

  plugins: [
    dash(),
    admin()
  ]
});