import { isValidPhoneNumber } from 'react-phone-number-input';
import z from 'zod';

export class AuthSchema {
  static signIn = z
    .object({
      phoneNumber: z.string().nonempty('Nomor ponsel harus diisi.'),
      password: z
        .string()
        .min(8, 'Kata sandi harus antara 8-20 karakter.')
        .max(20, 'Kata sandi harus antara 8-20 karakter.')
        .nonempty('Kata sandi harus diisi.'),
    })
    .refine((data) => isValidPhoneNumber(data.phoneNumber), {
      message: 'Nomor ponsel tidak valid.',
      path: ['phoneNumber'],
    });

  static signUp = z
    .object({
      name: z.string().max(225).nonempty('Nama lengkap harus diisi.'),
      phoneNumber: z.string().nonempty('Nomor ponsel harus diisi.'),
      password: z
        .string()
        .min(8, 'Kata sandi harus antara 8-20 karakter.')
        .max(20, 'Kata sandi harus antara 8-20 karakter.')
        .nonempty('Kata sandi harus diisi.'),
      confirmPassword: z
        .string()
        .nonempty('Konfirmasi kata sandi harus diisi.'),
    })
    .refine((data) => isValidPhoneNumber(data.phoneNumber), {
      message: 'Nomor ponsel tidak valid.',
      path: ['phoneNumber'],
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Kata sandi tidak cocok.',
      path: ['confirmPassword'],
    });

  static onboardingProfile = AuthSchema.signUp;
  static onboardingChangePhoneNumber = z
    .object({
      phoneNumber: z.string().nonempty('Nomor ponsel harus diisi.'),
    })
    .refine((data) => isValidPhoneNumber(data.phoneNumber), {
      message: 'Nomor ponsel tidak valid.',
      path: ['phoneNumber'],
    });

  static requestPasswordReset = z
    .object({
      phoneNumber: z.string().nonempty('Nomor ponsel harus diisi.'),
    })
    .refine((data) => isValidPhoneNumber(data.phoneNumber), {
      message: 'Nomor ponsel tidak valid.',
      path: ['phoneNumber'],
    });

  static verifyPasswordReset = z
    .object({
      phoneNumber: z.string().nonempty('Nomor ponsel harus diisi.'),
      otp: z.string().length(6, 'Kode verifikasi harus 6 digit.').nonempty('Kode verifikasi harus diisi.'),
      password: z
        .string()
        .min(8, 'Kata sandi harus antara 8-20 karakter.')
        .max(20, 'Kata sandi harus antara 8-20 karakter.')
        .nonempty('Kata sandi harus diisi.'),
      confirmPassword: z
        .string()
        .nonempty('Konfirmasi kata sandi harus diisi.'),
    })
    .refine((data) => isValidPhoneNumber(data.phoneNumber), {
      message: 'Nomor ponsel tidak valid.',
      path: ['phoneNumber'],
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Kata sandi tidak cocok.',
      path: ['confirmPassword'],
    });
}
