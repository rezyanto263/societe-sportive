import { createAuthClient } from 'better-auth/react';
import { phoneNumberClient, adminClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [phoneNumberClient(), adminClient()],
  basePath: '/api/v1/auth',
  baseURL: process.env.BETTER_AUTH_URL!,
});
