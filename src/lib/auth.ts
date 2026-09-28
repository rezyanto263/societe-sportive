import { betterAuth } from 'better-auth';
import { admin, phoneNumber } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import db from '@/database';
import * as schema from '@/database/schema';
import { nextCookies } from 'better-auth/next-js';
import { ac, organizer, player } from './permission';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,
  basePath: '/api/v1/auth',
  database: drizzleAdapter(db, { provider: 'pg', schema: schema }),

  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },

  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [
    admin({ ac, roles: { player, organizer }, defaultRole: 'player' }),

    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        console.log(`The code OTP for ${phoneNumber} is ${code}`);
      },

      sendPasswordResetOTP: async ({ phoneNumber, code }) => {
        console.log(`The code OTP for ${phoneNumber} is ${code}`);
      },

      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}@phone.local`;
        },
      },
    }),

    nextCookies(),
  ],

  user: {
    modelName: 'users',
    additionalFields: {
      phoneNumber: {
        type: 'string',
        required: false,
      },
      gender: {
        type: 'string',
        required: false,
      },
    },
  },
  session: { modelName: 'sessions' },
  account: { modelName: 'accounts' },
  verification: { modelName: 'verifications' },
});
