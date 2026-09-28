import { createAuthClient } from 'better-auth/react';
import { phoneNumberClient, adminClient } from 'better-auth/client/plugins';
import { ac, organizer, player } from './permission';

export const authClient = createAuthClient({
  plugins: [
    phoneNumberClient(),
    adminClient({ ac, roles: { player, organizer } }),
  ],
  basePath: '/api/v1/auth',
  baseURL: process.env.BETTER_AUTH_URL!,
});
