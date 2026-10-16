'use client';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';

import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { CurrencyInput } from '@/components/app/form/currency-input';
import ImageInput from '@/components/app/form/image-input';
import { PhoneInput } from '@/components/app/form/phone-input';
import { RichTextInput } from '@/components/app/form/rich-text-input';
import SecretInput from '@/components/app/form/secret-input';
import { TagsInput } from '@/components/app/form/tags-input';

import { AlertCircleIcon, InfoIcon, MarsIcon, VenusIcon } from 'lucide-react';

import type { ComponentProps } from 'react';

import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

// --------------------------------------------------
// Input types
// --------------------------------------------------

type NativeInputType = HTMLInputElement['type'];

type InputFieldType =
  | NativeInputType
  | 'gender'
  | 'currency'
  | 'tags'
  | 'richtext'
  | 'image';

// --------------------------------------------------
// Component map
// --------------------------------------------------

type InputComponentMap = {
  tel: typeof PhoneInput;
  gender: typeof RadioGroup;
  currency: typeof CurrencyInput;
  tags: typeof TagsInput;
  richtext: typeof RichTextInput;
  image: typeof ImageInput;
};

type FormControlledKeys =
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onBlur'
  | 'ref'
  | 'onValueChange';

type InputComponentPropsMap = {
  [K in keyof InputComponentMap]: Omit<
    ComponentProps<InputComponentMap[K]>,
    FormControlledKeys
  >;
};

// --------------------------------------------------
// Render prop
// --------------------------------------------------

type Render<T extends FieldValues, N extends FieldPath<T>> = (props: {
  field: ControllerRenderProps<T, N>;
  fieldState: ControllerFieldState;
  type: InputFieldType;
  secret?: boolean;
}) => React.ReactNode;

// --------------------------------------------------
// InputField props
// --------------------------------------------------

type InputFieldBaseProps<T extends FieldValues, N extends FieldPath<T>> = {
  field: ControllerRenderProps<T, N>;
  fieldState: ControllerFieldState;
  label: string;
  description?: string | React.ReactNode;
  required?: boolean;
  secret?: boolean;
  render?: Render<T, N>;
};

type CustomInputProps = {
  [K in keyof InputComponentMap]: {
    type: K;
    componentProps?: InputComponentPropsMap[K];
  };
}[keyof InputComponentMap];

type InputFieldProps<
  T extends FieldValues,
  N extends FieldPath<T>,
> = InputFieldBaseProps<T, N> &
  (
    | CustomInputProps
    | {
        type: 'text';
        componentProps?: never;
      }
    | {
        type?: Exclude<NativeInputType, 'text' | 'tel'>;
        componentProps?: never;
      }
  );

// --------------------------------------------------
// InputField
// --------------------------------------------------

export default function InputField<
  T extends FieldValues,
  N extends FieldPath<T>,
>(props: InputFieldProps<T, N>) {
  const {
    field,
    fieldState,
    label,
    description,
    required = false,
    render,
  } = props;

  const type = props.type ?? 'text';

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </FieldLabel>

      {render ? (
        render({
          field,
          fieldState,
          type,
          secret: props.secret,
        })
      ) : (
        <InputComponent {...props} />
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

// --------------------------------------------------
// InputComponent
// --------------------------------------------------

function InputComponent<T extends FieldValues, N extends FieldPath<T>>(
  props: InputFieldProps<T, N>,
) {
  const { field, fieldState } = props;
  const invalid = fieldState.invalid;

  switch (props.type) {
    case 'tel':
      return (
        <PhoneInput
          {...props.componentProps}
          {...field}
          defaultCountry={props.componentProps?.defaultCountry ?? 'ID'}
          aria-invalid={invalid}
        />
      );

    case 'gender':
      return (
        <RadioGroup
          {...props.componentProps}
          value={field.value}
          onValueChange={field.onChange}
          className="flex items-center gap-3 max-sm:flex-col"
          data-invalid={invalid}
        >
          <FieldLabel htmlFor="male" className="cursor-pointer">
            <Field orientation="horizontal" data-invalid={invalid}>
              <FieldTitle>
                <MarsIcon className="text-sky-800" />
                Laki-laki
              </FieldTitle>

              <RadioGroupItem value="male" id="male" aria-invalid={invalid} />
            </Field>
          </FieldLabel>

          <FieldLabel htmlFor="female" className="cursor-pointer">
            <Field orientation="horizontal" data-invalid={invalid}>
              <FieldTitle>
                <VenusIcon className="text-pink-800" />
                Perempuan
              </FieldTitle>

              <RadioGroupItem
                value="female"
                id="female"
                aria-invalid={invalid}
              />
            </Field>
          </FieldLabel>
        </RadioGroup>
      );

    case 'currency':
      return (
        <CurrencyInput
          {...props.componentProps}
          {...field}
          currency={props.componentProps?.currency ?? 'IDR'}
          locale={props.componentProps?.locale ?? 'id-ID'}
          fractionDigits={props.componentProps?.fractionDigits ?? 2}
          aria-invalid={invalid}
        />
      );

    case 'tags':
      return <TagsInput {...field} aria-invalid={invalid} />;

    case 'richtext':
      return <RichTextInput {...field} aria-invalid={invalid} />;

    case 'image':
      return (
        <ImageInput
          {...props.componentProps}
          value={field.value}
          onChange={field.onChange}
          aria-invalid={invalid}
        />
      );

    case 'text':
      return props.secret ? (
        <SecretInput {...field} aria-invalid={invalid} />
      ) : (
        <Input {...field} type="text" aria-invalid={invalid} />
      );

    default:
      return (
        <Input {...field} type={props.type ?? 'text'} aria-invalid={invalid} />
      );
  }
}
