import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  createdAt: timestamp().notNull().defaultNow(),
};

export const softDelete = { deletedAt: timestamp() };
