"use client";

import { useEffect, useId, useRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Locks page scroll, pauses smooth scrolling and closes on Escape while open. */
export function useLock(open: boolean, onClose: () => void) {
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close.current();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
}

/**
 * Side drawer on desktop, bottom sheet on phones. Focus moves into it when it
 * opens and Escape or the backdrop closes it.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  side = "right",
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  side?: "right" | "center";
  className?: string;
}) {
  useLock(open, onClose);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) requestAnimationFrame(() => box.current?.focus());
  }, [open]);
  const center = side === "center";
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" data-sheet>
          <motion.div
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            ref={box}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === "string" ? title : undefined}
            tabIndex={-1}
            initial={center ? { opacity: 0, y: 24 } : { x: "100%" }}
            animate={center ? { opacity: 1, y: 0 } : { x: 0 }}
            exit={center ? { opacity: 0, y: 24 } : { x: "100%" }}
            transition={{ duration: 0.42, ease }}
            className={`kit-sheet absolute flex flex-col bg-bg text-ink outline-none ${
              center
                ? "inset-x-3 bottom-3 max-h-[calc(100dvh-24px)] rounded-[var(--r-lg,20px)] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[460px] sm:-translate-x-1/2 sm:-translate-y-1/2"
                : "inset-y-0 right-0 w-full max-w-[460px]"
            } ${className}`}
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <h2 className="text-[17px] font-medium">{title}</h2>
              <button onClick={onClose} aria-label="Close" className="-mr-2 grid size-10 place-items-center rounded-full hover:bg-soft">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6" data-lenis-prevent>
              {children}
            </div>
            {footer && <div className="border-t border-line px-5 py-4 sm:px-6">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string;
  error?: string | false;
  hint?: string;
  onValue: (v: string) => void;
  as?: "input" | "textarea" | "select";
  options?: { value: string; label: string }[];
};

/** Labelled input with its error message under it. */
export function Field({ label, error, hint, onValue, as = "input", options, className = "", ...rest }: FieldProps) {
  const id = useId();
  const base = `w-full rounded-[var(--r-sm,10px)] border bg-transparent px-3.5 text-[15px] outline-none transition-colors focus:border-ink ${
    error ? "border-[var(--bad,#c4412b)]" : "border-line"
  }`;
  return (
    <div className={`grid min-w-0 gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[13px] text-muted">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          rows={3}
          className={`${base} py-3`}
          value={rest.value as string}
          placeholder={rest.placeholder}
          onChange={(e) => onValue(e.target.value)}
          aria-invalid={!!error}
        />
      ) : as === "select" ? (
        <select id={id} className={`${base} h-12 bg-bg`} value={rest.value as string} onChange={(e) => onValue(e.target.value)} aria-invalid={!!error}>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input id={id} {...rest} className={`${base} h-12`} onChange={(e) => onValue(e.target.value)} aria-invalid={!!error} />
      )}
      {error ? <p className="text-[12.5px] text-[var(--bad,#c4412b)]">{error}</p> : hint ? <p className="text-[12.5px] text-muted">{hint}</p> : null}
    </div>
  );
}

/** Choice card used for delivery and payment options. */
export function Choice({
  checked,
  onSelect,
  title,
  detail,
  aside,
  disabled,
}: {
  checked: boolean;
  onSelect: () => void;
  title: ReactNode;
  detail?: ReactNode;
  aside?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-[var(--r-sm,10px)] border px-4 py-3.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
        checked ? "border-ink bg-soft" : "border-line hover:border-muted"
      }`}
    >
      <span className={`mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full border ${checked ? "border-ink" : "border-line"}`}>
        {checked && <span className="size-2.5 rounded-full bg-ink" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px]">{title}</span>
        {detail && <span className="mt-0.5 block text-[13px] text-muted">{detail}</span>}
      </span>
      {aside && <span className="shrink-0 text-[14px]">{aside}</span>}
    </button>
  );
}

export function Qty({ value, onChange, max = 20, label = "Quantity" }: { value: number; onChange: (n: number) => void; max?: number; label?: string }) {
  return (
    <div className="inline-flex h-10 items-center rounded-full border border-line" role="group" aria-label={label}>
      <button type="button" className="grid size-10 place-items-center disabled:opacity-30" disabled={value <= 1} onClick={() => onChange(value - 1)} aria-label="Fewer">
        <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 6h8" />
        </svg>
      </button>
      <span className="w-6 text-center text-[14px] tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" className="grid size-10 place-items-center disabled:opacity-30" disabled={value >= max} onClick={() => onChange(value + 1)} aria-label="More">
        <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 6h8M6 2v8" />
        </svg>
      </button>
    </div>
  );
}

/** Small message that confirms an action, then fades. */
export function Toast({ message, onDone }: { message: string | null; onDone: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [message, onDone]);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease }}
            className="rounded-full bg-ink px-5 py-3 text-[14px] text-bg shadow-[0_10px_30px_rgb(0_0_0/0.25)]"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Responsive photo from /public/images with a soft placeholder while loading. */
export function Img({
  src,
  alt,
  ratio,
  className = "",
  imgClassName = "",
  sizes = "100vw",
  priority,
  widths = [800, 1600],
  position,
}: {
  src: string;
  alt: string;
  ratio?: number;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  widths?: number[];
  position?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) queueMicrotask(() => setReady(true));
  }, []);
  const abs = /\b(absolute|fixed)\b/.test(className);
  return (
    <div className={`${abs ? "" : "relative "}overflow-hidden bg-soft ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={`/images/${src}-${widths[widths.length - 1]}.webp`}
        srcSet={widths.map((w) => `/images/${src}-${w}.webp ${w}w`).join(", ")}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        onLoad={() => setReady(true)}
        style={position ? { objectPosition: position } : undefined}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"} ${imgClassName}`}
      />
    </div>
  );
}

export function Heart({ on, size = 18 }: { on: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
      <path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.4 3.6 4 7 4c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.4 0 5.6 3.4 4.3 6.8C19.5 15.4 12 20 12 20z" />
    </svg>
  );
}

export const Icon = {
  bag: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6.5a3 3 0 016 0V8" />
    </svg>
  ),
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  ),
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" />
    </svg>
  ),
  left: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  ),
  right: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M9 5l7 7-7 7" />
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 8h16M4 16h16" />
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
};
