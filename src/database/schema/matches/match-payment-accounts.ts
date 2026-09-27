import { matches } from '@/database/schema/matches/matches';
import { paymentAccounts } from '@/database/schema/payments/payment-accounts';
import { snakeCase, uuid } from 'drizzle-orm/pg-core';

export const matchPaymentAccounts = snakeCase.table('match_payment_accounts', {
  matchId: uuid()
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),
  paymentAccountId: uuid()
    .notNull()
    .references(() => paymentAccounts.id, { onDelete: 'cascade' }),
});
