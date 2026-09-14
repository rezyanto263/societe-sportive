import { pgEnum, timestamp } from 'drizzle-orm/pg-core';

export const gender = pgEnum('gender', ['male', 'female']);

export const timestamps = {
  updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  createdAt: timestamp().notNull().defaultNow(),
};

export const softDelete = { deletedAt: timestamp() };
