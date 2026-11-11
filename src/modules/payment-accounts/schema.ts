import { PAYMENT_ACCOUNT_TYPES } from '@/modules/payment-accounts/constants';
import z from 'zod';

export class PaymentAccountsSchema {
  static create = z
    .object({
      name: z
        .string()
        .min(1, 'Nama Rekening wajib diisi.')
        .max(100, 'Nama Rekening maksimal 100 karakter.'),
      type: z.enum([
        PAYMENT_ACCOUNT_TYPES.BANK,
        PAYMENT_ACCOUNT_TYPES.QRIS,
        PAYMENT_ACCOUNT_TYPES.E_WALLET,
        PAYMENT_ACCOUNT_TYPES.CASH,
      ]),
      providerName: z
        .string()
        .min(1, 'Nama Penyedia Rekening wajib diisi.')
        .max(100, 'Nama Penyedia Rekening maksimal 100 karakter.'),
      accountNumber: z
        .string()
        .trim()
        .min(1, 'Nomor Rekening wajib diisi.')
        .max(50, 'Nomor Rekening maksimal 50 karakter.'),
      accountHolderName: z
        .string()
        .min(1, 'Nama Pemilik Rekening wajib diisi.')
        .max(100, 'Nama Pemilik Rekening maksimal 100 karakter.'),
      imageId: z.uuid().nullable(),
      notes: z.string().max(200, 'Catatan maksimal 200 karakter.').nullable(),
      bookmark: z.boolean(),
    })
    .superRefine((data, ctx) => {
      if (data.type === PAYMENT_ACCOUNT_TYPES.QRIS && !data.imageId) {
        ctx.addIssue({
          code: 'custom',
          message: 'QRIS wajib memiliki gambar QR Code.',
          path: ['imageId'],
        });
      }
    });

  static searchParams = z.object({
    keyword: z.string().max(100).optional(),
    type: z
      .enum([
        PAYMENT_ACCOUNT_TYPES.BANK,
        PAYMENT_ACCOUNT_TYPES.QRIS,
        PAYMENT_ACCOUNT_TYPES.E_WALLET,
        PAYMENT_ACCOUNT_TYPES.CASH,
      ])
      .optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z
      .union([z.literal(10), z.literal(25), z.literal(50), z.literal(100)])
      .optional()
      .default(10),
  });

  static bookmark = z.object({
    id: z.uuid(),
    bookmark: z.boolean(),
  })
}
