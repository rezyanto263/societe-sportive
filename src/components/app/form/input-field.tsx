import { CurrencyInput } from '@/components/app/form/currency-input';
import { PhoneInput } from '@/components/app/form/phone-input';
import { RichTextInput } from '@/components/app/form/rich-text-input';
import SecretInput from '@/components/app/form/secret-input';
import { TagsInput } from '@/components/app/form/tags-input';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircleIcon, InfoIcon, MarsIcon, VenusIcon } from 'lucide-react';
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

type Render<T extends FieldValues, N extends FieldPath<T>> = (props: {
  field: ControllerRenderProps<T, N>;
  fieldState: ControllerFieldState;
  type?: HTMLInputElement['type'];
  secret?: boolean;
}) => React.ReactNode;

type InputFieldProps<T extends FieldValues, N extends FieldPath<T>> = {
  field: ControllerRenderProps<T, N>;
  fieldState: ControllerFieldState;
  label: string;
  description?: string | React.ReactNode;
  type?: HTMLInputElement['type'];
  required?: boolean;
  secret?: boolean;
  render?: Render<T, N>;
};

export default function InputField<
  T extends FieldValues,
  N extends FieldPath<T>,
>({
  field,
  fieldState,
  type = 'text',
  label,
  description,
  required = false,
  secret = false,
  render,
}: InputFieldProps<T, N>) {
  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <span className="text-destructive">*</span>}
      </FieldLabel>

      {render ? (
        render({ field, fieldState, secret, type })
      ) : (
        <InputComponent
          field={field}
          fieldState={fieldState}
          secret={secret}
          type={type}
        />
      )}

      {fieldState.invalid && (
        <div className="flex items-center gap-2">
          <AlertCircleIcon className="text-destructive" size={14} />
          <FieldError errors={[fieldState.error]} />
        </div>
      )}

      {description && (
        <div className="flex items-center gap-2">
          <InfoIcon className="text-muted-foreground shrink-0" size={14} />
          <FieldDescription>{description}</FieldDescription>
        </div>
      )}
    </Field>
  );
}

type InputComponentProps<T extends FieldValues, N extends FieldPath<T>> = Pick<
  InputFieldProps<T, N>,
  'secret' | 'field' | 'fieldState' | 'type'
>;

function InputComponent<T extends FieldValues, N extends FieldPath<T>>({
  secret,
  field,
  fieldState,
  type,
}: InputComponentProps<T, N>) {
  if (type === 'tel') {
    return (
      <PhoneInput
        {...field}
        aria-invalid={fieldState.invalid}
        defaultCountry="ID"
      />
    );
  } else if (type === 'text') {
    if (secret) {
      return <SecretInput {...field} aria-invalid={fieldState.invalid} />;
    }

    return <Input {...field} aria-invalid={fieldState.invalid} type={type} />;
  } else if (type === 'gender') {
    return (
      <RadioGroup
        defaultValue={field.value}
        className="flex items-center gap-3 max-sm:flex-col"
        data-invalid={fieldState.invalid}
      >
        <FieldLabel htmlFor="male" className="cursor-pointer">
          <Field orientation="horizontal" data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldTitle>
                <MarsIcon className="text-sky-800" /> Laki-laki
              </FieldTitle>
            </FieldContent>
            <RadioGroupItem
              value="male"
              id="male"
              aria-invalid={fieldState.invalid}
            />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="female" className="cursor-pointer">
          <Field orientation="horizontal" data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldTitle>
                <VenusIcon className="text-pink-800" /> Perempuan
              </FieldTitle>
            </FieldContent>
            <RadioGroupItem
              value="female"
              id="female"
              aria-invalid={fieldState.invalid}
            />
          </Field>
        </FieldLabel>
      </RadioGroup>
    );
  } else if (type === 'currency') {
    return (
      <CurrencyInput
        {...field}
        aria-invalid={fieldState.invalid}
        currency="IDR"
        locale="id-ID"
        fractionDigits={2}
      />
    );
  } else if (type === 'tags') {
    return (
      <TagsInput {...field} aria-invalid={fieldState.invalid} />
    )
  } else if (type === 'richtext') {
    return (
      <RichTextInput {...field} aria-invalid={fieldState.invalid} />
    )
  }
}
