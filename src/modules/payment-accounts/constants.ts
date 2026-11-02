import { paymentAccountTypes } from "@/core/database/schema";

export const PAYMENT_ACCOUNT_TYPES = {
  BANK: paymentAccountTypes.enumValues[0],
  QRIS: paymentAccountTypes.enumValues[1],
  E_WALLET: paymentAccountTypes.enumValues[2],
  CASH: paymentAccountTypes.enumValues[3],
} as const;