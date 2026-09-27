import { timestamps } from '@/database/utils';
import { boolean, pgEnum, snakeCase, text, uuid } from 'drizzle-orm/pg-core';

export const paymentAccountTypes = pgEnum('payment_account_types', [
  'bank',
  'qris',
  'e-wallet',
]);

export const paymentAccounts = snakeCase.table('payment_accounts', {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  type: paymentAccountTypes().notNull(),
  providerName: text().notNull(),
  accountNumber: text(),
  accountHolderName: text().notNull(),
  imageUrl: text(),
  bookmark: boolean().default(false),
  ...timestamps,
});
