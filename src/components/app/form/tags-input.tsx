'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export interface TagsInputProps
  extends Omit<
    React.ComponentProps<'input'>,
    'value' | 'defaultValue' | 'onChange' | 'type'
  > {
  value?: string[];
  defaultValue?: string[];
  /** Dipanggil dengan array tag terbaru (bukan event) */
  onChange?: (tags: string[]) => void;
  /** Class untuk container luar. `className` diterapkan ke <input> di dalamnya */
  containerClassName?: string;
  /** Jumlah tag maksimal */
  maxTags?: number;
  /** Izinkan tag yang sama muncul lebih dari sekali */
  allowDuplicates?: boolean;
  /** Karakter pemisah selain Enter, default: koma */
  delimiter?: string;
  /** Validasi tag sebelum ditambahkan. Return false untuk menolak. */
  validate?: (tag: string) => boolean;
}

const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
  (
    {
      value,
      defaultValue = [],
      onChange,
      containerClassName,
      maxTags,
      allowDuplicates = false,
      delimiter = ',',
      validate,
      className,
      placeholder,
      disabled,
      onBlur,
      onKeyDown,
      onPaste,
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState<string[]>(defaultValue);
    const [draft, setDraft] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const isControlled = value !== undefined;
    const tags = isControlled ? value : internal;

    const commit = (next: string[]) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const addTags = (raw: string[]) => {
      const next = [...tags];
      for (const item of raw) {
        const tag = item.trim();
        if (!tag) continue;
        if (maxTags !== undefined && next.length >= maxTags) break;
        if (!allowDuplicates && next.includes(tag)) continue;
        if (validate && !validate(tag)) continue;
        next.push(tag);
      }
      if (next.length !== tags.length) commit(next);
      setDraft('');
    };

    const removeTag = (index: number) => {
      commit(tags.filter((_, i) => i !== index));
      inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (e.key === 'Enter' || e.key === delimiter) {
        e.preventDefault();
        addTags([draft]);
      } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
        removeTag(tags.length - 1);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      onPaste?.(e);
      if (e.defaultPrevented) return;
      const text = e.clipboardData.getData('text');
      if (/[,\n\t;]/.test(text)) {
        e.preventDefault();
        addTags(text.split(/[,\n\t;]/));
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (draft) addTags([draft]);
      onBlur?.(e);
    };

    const limitReached = maxTags !== undefined && tags.length >= maxTags;

    return (
      <div
        data-slot="tags-input"
        data-disabled={disabled ? '' : undefined}
        onClick={() => inputRef.current?.focus()}
        className={cn(
          'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-3xl bg-input/50 text-sm shadow-xs transition-[color,box-shadow] px-3 py-1 overflow-hidden border border-transparent',
          'has-focus-within:border-ring has-focus-within:ring-3 has-focus-within:ring-ring/30',
          'has-aria-invalid:ring-2 has-aria-invalid:ring-destructive/40',
          'data-disabled:pointer-events-none data-disabled:opacity-50',
          containerClassName,
        )}
      >
        {tags.map((tag, index) => (
          <Badge
            key={`${tag}-${index}`}
            variant="default"
            className="max-w-full gap-1 pr-1"
          >
            <span className="min-w-0 truncate" title={tag}>
              {tag}
            </span>
            <button
              type="button"
              disabled={disabled}
              aria-label={`Hapus ${tag}`}
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="hover:bg-foreground/10 focus-visible:ring-ring shrink-0 rounded-sm p-0.5 outline-none focus-visible:ring-2"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
        <Input
          {...props}
          ref={inputRef}
          type="text"
          value={draft}
          disabled={disabled || limitReached}
          placeholder={
            tags.length === 0 ? placeholder : limitReached ? '' : undefined
          }
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={handleBlur}
          className={cn(
            'min-w-24 flex-1 bg-transparent disabled:cursor-not-allowed ring-0! border-none! outline-none! p-0 rounded-none h-fit',
            className,
          )}
        />
      </div>
    );
  },
);
TagsInput.displayName = 'TagsInput';

export { TagsInput };