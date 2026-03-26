import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { dash } from '@better-auth/infra';

const isProd = process.env.NODE_ENV === 'production';
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: { enabled: true },

  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://192.168.1.37:3000',
    'https://09b5-2001-fb1-5f-e98-f121-fdf8-e57-a8e9.ngrok-free.app',
    'https://9pm.website'
  ],

  advanced: {
    defaultCookieAttributes: {
      domain: isProd ? '.9pm.website' : 'localhost',
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd ? true : false,
    }
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    storeSessionInDatabase: true,
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

  plugins: [dash()],
});