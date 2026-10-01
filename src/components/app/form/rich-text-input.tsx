"use client";

import * as React from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extension-character-count";
import { TextStyle } from "@tiptap/extension-text-style";

import { cn } from "@/lib/utils";
import { RichTextEditor, Link } from "@/components/editor";
import "@/components/editor/style.css";

export interface RichTextInputHandle {
  focus: () => void;
}

export interface RichTextInputProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange" | "defaultValue"> {
  /** HTML string (controlled) */
  value?: string;
  /** HTML string (uncontrolled) */
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
  placeholder?: string;
  showWordCount?: boolean;
}

const RichTextInput = React.forwardRef<RichTextInputHandle, RichTextInputProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      onBlur,
      name,
      disabled = false,
      placeholder,
      showWordCount = true,
      id,
      className,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    // Simpan callback terbaru agar tidak stale di dalam opsi editor
    const onChangeRef = React.useRef(onChange);
    const onBlurRef = React.useRef(onBlur);
    React.useEffect(() => {
      onChangeRef.current = onChange;
      onBlurRef.current = onBlur;
    });

    const editor = useEditor({
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      editable: !disabled,
      content: value ?? defaultValue ?? "",
      extensions: [
        StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
        Link,
        Underline,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        CharacterCount,
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
        Placeholder.configure({ placeholder: placeholder ?? "" }),
      ],
      onUpdate: ({ editor }) => {
        // Kosong -> "" supaya validasi required (zod .min(1)) bekerja
        onChangeRef.current?.(editor.isEmpty ? "" : editor.getHTML());
      },
      onBlur: () => onBlurRef.current?.(),
    });

    // Sinkronisasi value eksternal (form.reset, setValue, dll.)
    React.useEffect(() => {
      if (!editor || value === undefined) return;
      const current = editor.isEmpty ? "" : editor.getHTML();
      if (value !== current) {
        editor.commands.setContent(value, { emitUpdate: false });
      }
    }, [value, editor]);

    // Sinkronisasi disabled
    React.useEffect(() => {
      editor?.setEditable(!disabled);
    }, [disabled, editor]);

    // Teruskan id / aria-* ke elemen contenteditable (untuk Label & FormControl)
    React.useEffect(() => {
      if (!editor) return;
      editor.setOptions({
        editorProps: {
          attributes: {
            ...(id ? { id } : {}),
            ...(name ? { "data-name": name } : {}),
            ...(ariaInvalid ? { "aria-invalid": String(ariaInvalid) } : {}),
            ...(ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {}),
          },
        },
      });
    }, [editor, id, name, ariaInvalid, ariaDescribedBy]);

    // RHF memanggil field.ref.focus() saat validasi gagal
    React.useImperativeHandle(
      ref,
      () => ({ focus: () => editor?.commands.focus() }),
      [editor]
    );

    return (
      <div
        data-slot="rich-text-input"
        data-invalid={ariaInvalid ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        className={cn(
          "w-full rounded-lg",
          "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
          'has-focus-within:border-ring has-focus-within:ring-3 has-focus-within:ring-ring/30',
          'has-aria-invalid:ring-2 has-aria-invalid:ring-destructive/40',
          'shadow-none! drop-shadow-none!',
          className
        )}
        {...props}
      >
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky className='shadow-none!'>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.Code />
              <RichTextEditor.ClearFormatting />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.BubbleMenu editor={editor} />
          <RichTextEditor.Content />
          <RichTextEditor.Footer showWordCount={showWordCount} />
        </RichTextEditor>
      </div>
    );
  }
);
RichTextInput.displayName = "RichTextInput";

export { RichTextInput };