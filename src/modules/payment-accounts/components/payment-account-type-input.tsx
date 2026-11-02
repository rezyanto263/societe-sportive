'use client';

import { PAYMENT_ACCOUNT_TYPES } from '@/modules/payment-accounts/constants';
import { InputFieldProps } from '@/shared/components/app/form/input-field';
import { Field, FieldLabel, FieldTitle } from '@/shared/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { BanknoteIcon, LandmarkIcon, QrCodeIcon, WalletIcon } from 'lucide-react';
import { FieldPath, FieldValues } from 'react-hook-form';

export default function PaymentAccountTypeInput<
  T extends FieldValues,
  N extends FieldPath<T>,
>({ field, fieldState }: Omit<InputFieldProps<T, N>, 'label' | 'render'>) {
  return (
    <RadioGroup
      value={field.value}
      onValueChange={field.onChange}
      className="grid md:grid-cols-2 xl:grid-cols-4 gap-3"
      data-invalid={fieldState.invalid}
    >
      <FieldLabel
        htmlFor={PAYMENT_ACCOUNT_TYPES.BANK}
        className="cursor-pointer"
      >
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <FieldTitle>
            <LandmarkIcon />
            BANK
          </FieldTitle>

          <RadioGroupItem
            value={PAYMENT_ACCOUNT_TYPES.BANK}
            id={PAYMENT_ACCOUNT_TYPES.BANK}
            aria-invalid={fieldState.invalid}
          />
        </Field>
      </FieldLabel>

      <FieldLabel
        htmlFor={PAYMENT_ACCOUNT_TYPES.CASH}
        className="cursor-pointer"
      >
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <FieldTitle>
            <BanknoteIcon />
            CASH
          </FieldTitle>

          <RadioGroupItem
            value={PAYMENT_ACCOUNT_TYPES.CASH}
            id={PAYMENT_ACCOUNT_TYPES.CASH}
            aria-invalid={fieldState.invalid}
          />
        </Field>
      </FieldLabel>

      <FieldLabel
        htmlFor={PAYMENT_ACCOUNT_TYPES.E_WALLET}
        className="cursor-pointer"
      >
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <FieldTitle>
            <WalletIcon />
            E-WALLET
          </FieldTitle>

          <RadioGroupItem
            value={PAYMENT_ACCOUNT_TYPES.E_WALLET}
            id={PAYMENT_ACCOUNT_TYPES.E_WALLET}
            aria-invalid={fieldState.invalid}
          />
        </Field>
      </FieldLabel>

      <FieldLabel
        htmlFor={PAYMENT_ACCOUNT_TYPES.QRIS}
        className="cursor-pointer"
      >
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <FieldTitle>
            <QrCodeIcon />
            QRIS
          </FieldTitle>

          <RadioGroupItem
            value={PAYMENT_ACCOUNT_TYPES.QRIS}
            id={PAYMENT_ACCOUNT_TYPES.QRIS}
            aria-invalid={fieldState.invalid}
          />
        </Field>
      </FieldLabel>
    </RadioGroup>
  );
}
