"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

/**
 * CurrencyInput
 *
 * - While typing, the field shows the currency symbol and grouping live
 *   ("1234.5" → "$1,234.5"), in the notation of the chosen locale.
 * - What the form receives is always a plain number (1234.5) or null.
 * - Works directly with React Hook Form: <CurrencyInput {...field} />
 *   (inside <Controller> / shadcn <FormField>).
 */

interface CurrencyInputProps
  extends Omit<
    React.ComponentPropsWithoutRef<"input">,
    "value" | "defaultValue" | "onChange" | "type"
  > {
  /** Controlled amount in major units (1234.5). `null` / `undefined` = empty. */
  value?: number | null
  /** Initial amount for uncontrolled use. */
  defaultValue?: number | null
  /** Fires on every keystroke with the parsed number (`null` when empty).
   *  Same signature as RHF's `field.onChange`, so `{...field}` just works. */
  onChange?: (value: number | null) => void
  /** Alias of `onChange`, kept for convenience. */
  onValueChange?: (value: number | null) => void
  /** ISO 4217 currency code (default "USD"). e.g. "IDR", "JPY", "EUR". */
  currency?: string
  /** BCP 47 locale for grouping / symbol placement (default "en-US"). e.g. "id-ID". */
  locale?: string
  /** Allow negative amounts (default false). */
  allowNegative?: boolean
  /** Force the number of decimal places, overriding the currency default.
   *  IDR and JPY have 0 by default, so pass `fractionDigits={2}` to allow cents. */
  fractionDigits?: number
}

type Raw = { neg: boolean; int: string; frac: string; hasDecimal: boolean }

const MAX_INT_DIGITS = 15 // stays inside Number.MAX_SAFE_INTEGER

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

const isDigit = (ch: string) => ch >= "0" && ch <= "9"

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(function CurrencyInput(props, forwardedRef) {
  const {
    className,
    value,
    defaultValue,
    onChange,
    onValueChange,
    currency = "USD",
    locale = "en-US",
    allowNegative = false,
    fractionDigits,
    onBlur,
    onKeyDown,
    placeholder,
    ...rest
  } = props

  // `"value" in props` (not `value !== undefined`) so RHF's `{...field}` with an
  // initially-undefined value stays controlled instead of flipping later.
  const isControlled = "value" in props

  const innerRef = React.useRef<HTMLInputElement>(null)
  React.useImperativeHandle(
    forwardedRef,
    () => innerRef.current as HTMLInputElement
  )

  // Everything locale/currency-specific, computed once per locale+currency.
  const fmt = React.useMemo(() => {
    // Force latin digits so we only ever deal with 0-9.
    const loc = locale.includes("-u-") ? locale : `${locale}-u-nu-latn`
    const currencyFormat = new Intl.NumberFormat(loc, {
      style: "currency",
      currency,
      ...(fractionDigits !== undefined && {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }),
    })
    const digits = currencyFormat.resolvedOptions().maximumFractionDigits ?? 2

    // 1111111.1 so locales with minimum grouping digits (es-ES) still show a group.
    const sample = currencyFormat.formatToParts(1111111.1)
    const group = sample.find((p) => p.type === "group")?.value ?? ","
    // "" when the currency has no decimals (IDR, JPY). Never fall back to "."
    // here: in id-ID / de-DE that is the *group* separator, and treating it as
    // a decimal makes the caret math count every thousands dot as a digit.
    const decimal =
      digits > 0 ? sample.find((p) => p.type === "decimal")?.value ?? "." : ""

    // Where the symbol sits: "$1.00" → prefix "$"; "1,00 €" → suffix " €".
    const one = currencyFormat.formatToParts(1)
    const numeric = ["integer", "group", "decimal", "fraction"]
    const firstNum = one.findIndex((p) => p.type === "integer")
    let lastNum = -1
    one.forEach((p, i) => {
      if (numeric.includes(p.type)) lastNum = i
    })
    const prefix = one
      .slice(0, firstNum)
      .map((p) => p.value)
      .join("")
    const suffix = one
      .slice(lastNum + 1)
      .map((p) => p.value)
      .join("")
    const symbol = one.find((p) => p.type === "currency")?.value ?? currency

    const intFormat = new Intl.NumberFormat(loc, { maximumFractionDigits: 0 })

    return {
      currencyFormat,
      intFormat,
      digits,
      group,
      decimal,
      prefix,
      suffix,
      symbol,
    }
  }, [locale, currency, fractionDigits])

  // ---- text <-> number helpers -------------------------------------------

  // Reduce whatever is in the field (symbol, separators, pasted junk) to its
  // significant parts: sign, integer digits, decimal digits.
  function toRaw(input: string): Raw {
    const cleaned = input.split(fmt.symbol).join("")
    let neg = false
    let int = ""
    let frac = ""
    let hasDecimal = false
    for (const ch of cleaned) {
      if (isDigit(ch)) {
        if (hasDecimal) {
          if (frac.length < fmt.digits) frac += ch
        } else if (int.length < MAX_INT_DIGITS) {
          int += ch
        }
      } else if (
        !hasDecimal &&
        fmt.digits > 0 &&
        (ch === fmt.decimal || (ch === "." && fmt.group !== "."))
      ) {
        hasDecimal = true
      } else if (
        (ch === "-" || ch === "\u2212") &&
        allowNegative &&
        !neg &&
        int === "" &&
        !hasDecimal
      ) {
        neg = true
      }
    }
    int = int.replace(/^0+(?=\d)/, "")
    return { neg, int, frac, hasDecimal }
  }

  function toNumber(raw: Raw): number | null {
    if (raw.int === "" && raw.frac === "") return null
    const n = Number(`${raw.int || "0"}.${raw.frac || "0"}`)
    return raw.neg && n !== 0 ? -n : n
  }

  // The live display: symbol + grouped integer + decimals exactly as typed.
  function formatRaw(raw: Raw): string {
    const hasAny = raw.int !== "" || raw.frac !== "" || raw.hasDecimal
    if (!hasAny) return raw.neg ? "-" : ""
    const intPart = fmt.intFormat.format(Number(raw.int || "0"))
    const body = intPart + (raw.hasDecimal ? fmt.decimal + raw.frac : "")
    return (raw.neg ? "-" : "") + fmt.prefix + body + fmt.suffix
  }

  function fromNumber(n: number | null, live: boolean): string {
    if (n === null) return ""
    if (!live) return fmt.currencyFormat.format(n) // padded: "$1,234.50"
    const [i, f = ""] = Math.abs(n).toFixed(fmt.digits).split(".")
    const frac = f.replace(/0+$/, "")
    return formatRaw({
      neg: n < 0,
      int: i,
      frac,
      hasDecimal: frac.length > 0,
    })
  }

  // ---- state -------------------------------------------------------------

  const numRef = React.useRef<number | null>(
    (isControlled ? value : defaultValue) ?? null
  )
  const [text, setText] = React.useState(() => fromNumber(numRef.current, false))
  const [, force] = React.useReducer((x: number) => x + 1, 0)
  const pendingCaret = React.useRef<number | null>(null)
  const lastFormatter = React.useRef(fmt)

  // Keep the field in sync when the form changes the value from outside
  // (reset(), setValue(), async defaultValues) or when currency/locale change.
  React.useEffect(() => {
    const formatterChanged = lastFormatter.current !== fmt
    lastFormatter.current = fmt
    const target = isControlled ? value ?? null : numRef.current
    if (formatterChanged || target !== toNumber(toRaw(text))) {
      const focused = document.activeElement === innerRef.current
      numRef.current = target
      setText(fromNumber(target, focused))
    }
    // `text` is intentionally omitted: this only reacts to outside changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, fmt, isControlled])

  // Restore the caret after reformatting, so typing in the middle of the
  // number doesn't throw the cursor to the end.
  useIsomorphicLayoutEffect(() => {
    const pos = pendingCaret.current
    if (pos === null) return
    pendingCaret.current = null
    const el = innerRef.current
    if (!el || document.activeElement !== el) return
    el.setSelectionRange(pos, pos)
    // Some mobile keyboards move the caret again after the event; set it once
    // more on the next frame.
    requestAnimationFrame(() => {
      if (document.activeElement === el) el.setSelectionRange(pos, pos)
    })
  })

  // Position in `formatted` right after the n-th significant char (digit or
  // decimal separator).
  function caretFor(formatted: string, n: number) {
    if (formatted === "" || formatted === "-") return formatted.length
    const start = Math.min(
      (formatted.startsWith("-") ? 1 : 0) + fmt.prefix.length,
      formatted.length
    )
    const end = formatted.length - fmt.suffix.length
    if (n <= 0) return start
    let count = 0
    for (let i = start; i < end; i++) {
      const ch = formatted[i]
      if (isDigit(ch) || ch === fmt.decimal) {
        count++
        if (count === n) return i + 1
      }
    }
    return Math.max(start, end)
  }

  function apply(nextValue: string, caret: number) {
    const raw = toRaw(nextValue)
    const before = toRaw(nextValue.slice(0, caret))
    let n = before.int.length + before.frac.length + (before.hasDecimal ? 1 : 0)
    if (before.int === "" && before.hasDecimal) n += 1 // the synthesized "0"

    const formatted = formatRaw(raw)
    const num = toNumber(raw)

    pendingCaret.current = caretFor(formatted, n)
    numRef.current = num
    setText(formatted)
    force() // re-run the caret effect even if the text didn't change
    onChange?.(num)
    onValueChange?.(num)
  }

  // ---- handlers ----------------------------------------------------------

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const el = e.target
    apply(el.value, el.selectionStart ?? el.value.length)
  }

  // Backspace / Delete next to a separator or the symbol would otherwise do
  // nothing (the separator is re-added). Skip over it and delete the digit.
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(e)
    if (e.defaultPrevented) return
    const el = e.currentTarget
    const s = el.selectionStart
    if (s === null || s !== el.selectionEnd) return
    const cur = el.value
    const isSig = (ch: string) => isDigit(ch) || ch === fmt.decimal || ch === "-"

    if (e.key === "Backspace") {
      let i = s
      while (i > 0 && !isSig(cur[i - 1])) i--
      if (i === s) return
      e.preventDefault()
      if (i > 0) apply(cur.slice(0, i - 1) + cur.slice(i), i - 1)
    } else if (e.key === "Delete") {
      let i = s
      while (i < cur.length && !isSig(cur[i])) i++
      if (i === s) return
      e.preventDefault()
      if (i < cur.length) apply(cur.slice(0, i) + cur.slice(i + 1), i)
    }
  }

  // On blur, settle into the full currency format ("$1,234.50").
  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setText(fromNumber(numRef.current, false))
    onBlur?.(e)
  }

  return (
    <Input
      {...rest}
      ref={innerRef}
      type="text"
      inputMode={fmt.digits > 0 ? "decimal" : "numeric"}
      autoComplete="off"
      placeholder={placeholder}
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className={cn("tabular-nums", className)}
    />
  )
})