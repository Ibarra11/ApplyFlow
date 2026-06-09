import * as React from "react";
import { Check, Pencil, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";

const inputClass =
  "w-full min-w-0 border-2 border-neutral-900 bg-white px-2.5 py-1.5 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-violet-600";

export function TextInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return <input type="text" className={cn(inputClass, className)} {...props} />;
}

export function TextArea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(inputClass, "min-h-20 resize-y leading-snug", className)}
      {...props}
    />
  );
}

export function LabeledField({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label
        htmlFor={htmlFor}
        className="font-mono text-[0.6875rem] font-bold tracking-wide text-neutral-500 uppercase"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function Chip({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border-2 border-neutral-900 bg-white px-2 py-0.5 text-xs font-semibold text-neutral-900",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EditButton({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex items-center gap-1 border-2 border-neutral-900 bg-white px-2 py-1 font-mono text-[0.6875rem] font-bold tracking-wide text-neutral-900 uppercase transition-all hover:-translate-y-0.5 hover:bg-lime-200 hover:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
        className,
      )}
      {...props}
    >
      <Pencil className="size-3 shrink-0 stroke-neutral-900" />
      Edit
    </button>
  );
}

export function SaveButton({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1 border-2 border-neutral-900 bg-lime-300 px-2 py-1 font-mono text-[0.6875rem] font-bold tracking-wide text-neutral-900 uppercase transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    >
      <Check className="size-3 shrink-0 stroke-neutral-900" />
      Save
    </button>
  );
}

export function CancelButton({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1 border-2 border-neutral-900 bg-white px-2 py-1 font-mono text-[0.6875rem] font-bold tracking-wide text-neutral-600 uppercase transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
        className,
      )}
      {...props}
    >
      <X className="size-3 shrink-0" />
      Cancel
    </button>
  );
}

export function AddButton({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex w-full items-center justify-center gap-1.5 border-2 border-dashed border-neutral-900 bg-white py-1.5 font-mono text-[0.6875rem] font-bold tracking-wide text-neutral-700 uppercase transition-colors hover:bg-violet-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
        className,
      )}
      {...props}
    >
      <Plus className="size-3.5 shrink-0" />
      {children}
    </button>
  );
}

export function RemoveButton({
  className,
  label,
  ...props
}: React.ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "relative inline-flex size-6 shrink-0 items-center justify-center border-2 border-neutral-900 bg-white text-neutral-700 transition-colors hover:bg-red-200 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
        className,
      )}
      {...props}
    >
      <X className="size-3.5" />
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
      />
    </button>
  );
}

/** Renders a textarea where each non-empty line becomes a list item. */
export function LineListInput({
  value,
  onChange,
  placeholder,
  id,
  rows = 4,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  id?: string;
  rows?: number;
}) {
  return (
    <TextArea
      id={id}
      rows={rows}
      placeholder={placeholder}
      value={value.join("\n")}
      onChange={(e) => onChange(e.target.value.split("\n"))}
    />
  );
}
