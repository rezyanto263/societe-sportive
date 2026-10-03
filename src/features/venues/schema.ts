import { isValidPhoneNumber } from 'react-phone-number-input';
import z from 'zod';

export class VenuesSchema {
  static create = z
    .object({
      sportId: z.uuid().nonempty('Sport ID harus diisi.'),
      name: z
        .string()
        .max(100, 'Nama tempat maksimal 100 karakter.')
        .nonempty('Nama tempat harus diisi.'),
      phoneNumber: z.string().nonempty('Nomor ponsel harus diisi.'),
      googleMapsUrl: z
        .url('Tautan tidak valid.')
        .nonempty('Tautan google maps harus diisi.'),
      address: z
        .string()
        .max(200, 'Alamat maksimal 200 karakter.')
        .nonempty('Alamat harus diisi.'),
      facilities: z.array(z.string()),
      notes: z.string().max(2000, 'Catatan maksimal 2000 karakter.').nullable(),
      fee: z
        .number({
          error: (iss) =>
            iss.input === undefined || iss.input === null
              ? 'Harga sewa harus diisi.'
              : 'Harga sewa harus berupa angka.',
        })
        .min(0, 'Harga sewa tidak boleh negatif.'),
      courts: z
        .array(
          z.object({
            name: z
              .string()
              .max(100, 'Nama Lapangan maksimal 100 karakter.')
              .nonempty('Nama lapangan harus diisi.'),
            specifications: z.array(z.string()).nullable(),
          }),
        )
        .min(1, 'Minimal 1 lapangan yang tersedia.'),
    })
    .refine((data) => isValidPhoneNumber(data.phoneNumber), {
      message: 'Nomor ponsel tidak valid.',
      path: ['phoneNumber'],
    });

  static update = VenuesSchema.create.safeExtend({
    id: z.uuid('ID tidak valid.').nonempty('ID tempat harus diisi.'),
    courts: z
      .array(
        z.object({
          id: z.uuid('ID tidak valid.').nullable(),
          name: z
            .string()
            .max(100, 'Nama Lapangan maksimal 100 karakter.')
            .nonempty('Nama lapangan harus diisi.'),
          specifications: z.array(z.string()).nullable(),
        }),
      )
      .min(1, 'Minimal 1 lapangan yang tersedia.'),
  });

  static delete = z.object({
    id: z.uuid('ID tidak valid.'),
    name: z
      .string()
      .max(100, 'Konfirmasi nama lapangan maksimal 100 karakter.')
      .nonempty('Konfirmasi nama lapangan harus diisi.'),
  });
}
