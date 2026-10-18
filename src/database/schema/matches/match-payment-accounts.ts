import { matches } from '@/database/schema/matches/matches';
import { paymentAccounts } from '@/database/schema/payments/payment-accounts';
import { primaryKey, snakeCase, uuid } from 'drizzle-orm/pg-core';

export const matchPaymentAccounts = snakeCase.table(
  'match_payment_accounts',
  {
    matchId: uuid()
      .notNull()
      .references(() => matches.id, { onDelete: 'cascade' }),
    paymentAccountId: uuid()
      .notNull()
      .references(() => paymentAccounts.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.matchId, t.paymentAccountId] })],
);
