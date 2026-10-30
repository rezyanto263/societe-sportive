import { createAuthClient } from 'better-auth/react';
import { phoneNumberClient, adminClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { ac, organizer, player } from '../config/permission';
import { auth } from '@/core/auth/server';

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    phoneNumberClient(),
    adminClient({ ac, roles: { player, organizer } }),
  ],
  basePath: '/api/v1/auth',
  baseURL: process.env.BETTER_AUTH_URL!,
});
