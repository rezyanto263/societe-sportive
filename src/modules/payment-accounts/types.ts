import { PAYMENT_ACCOUNT_TYPES } from '@/modules/payment-accounts/constants';
import { PaymentAccountsSchema } from '@/modules/payment-accounts/schema';
import z from 'zod';

export type PaymentAccountType =
  (typeof PAYMENT_ACCOUNT_TYPES)[keyof typeof PAYMENT_ACCOUNT_TYPES];

export type CreatePaymentAccountData = z.infer<
  typeof PaymentAccountsSchema.create
>;
