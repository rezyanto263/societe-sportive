import { medias } from '@/core/database/schema/medias/medias';
import { softDelete, timestamps } from '@/core/database/utils';
import { boolean, pgEnum, snakeCase, text, uuid } from 'drizzle-orm/pg-core';

export const paymentAccountTypes = pgEnum('payment_account_types', [
  'bank',
  'qris',
  'e-wallet',
  'cash',
]);

export const paymentAccounts = snakeCase.table('payment_accounts', {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  type: paymentAccountTypes().notNull(),
  providerName: text().notNull(),
  accountNumber: text().notNull(),
  accountHolderName: text().notNull(),
  imageId: uuid().references(() => medias.id, { onDelete: 'set null' }),
  bookmark: boolean().notNull().default(false),
  notes: text(),
  ...softDelete,
  ...timestamps,
});
