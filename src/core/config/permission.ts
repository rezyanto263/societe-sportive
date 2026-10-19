import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

export const statements = {
  ...defaultStatements,
  matches: [
    'create',
    'list',
    'read',
    'update',
    'delete',
    'join',
    'review-payments',
    'create-matchmaking',
  ],
  venues: ['create', 'list', 'read', 'update', 'delete'],
  paymentAccounts: ['create', 'list', 'read', 'update', 'delete'],
  members: ['create', 'list', 'read', 'update', 'delete'],
  profile: ['read', 'update'],
} as const;

export const ac = createAccessControl(statements);

export const player = ac.newRole({
  matches: ['list', 'read', 'join'],
  members: ['read'],
  profile: ['read', 'update'],
});

export const organizer = ac.newRole({
  ...adminAc.statements,
  matches: [
    'create',
    'list',
    'read',
    'update',
    'delete',
    'join',
    'review-payments',
    'create-matchmaking',
  ],
  venues: ['create', 'list', 'read', 'update', 'delete'],
  paymentAccounts: ['create', 'list', 'read', 'update', 'delete'],
  members: ['create', 'list', 'read', 'update', 'delete'],
  profile: ['read', 'update'],
});
