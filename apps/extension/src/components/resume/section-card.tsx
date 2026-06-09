import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { CancelButton, EditButton, SaveButton } from "./controls";
import { CopyButton } from "./copy";

export function SectionCard({
  label,
  icon: Icon,
  accentClassName,
  actions,
  children,
}: {
  label: string;
  icon: LucideIcon;
  accentClassName: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-2 border-neutral-900 bg-white shadow-[4px_4px_0_0_#171717]">
      <header className="flex items-center justify-between gap-2 border-b-2 border-neutral-900 px-3 py-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 border-2 border-neutral-900 px-2 py-0.5",
            accentClassName,
          )}
        >
          <Icon className="size-3.5 shrink-0 stroke-neutral-900" />
          <span className="font-mono text-xs font-bold tracking-wide text-neutral-900 uppercase">
            {label}
          </span>
        </span>
        {actions}
      </header>
      <div className="p-3">{children}</div>
    </section>
  );
}

/** Standard copy/edit/save/cancel control cluster for the section header. */
export function SectionActions({
  editing,
  onEdit,
  onSave,
  onCancel,
  saving,
  copyText,
}: {
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
  /** Plain-text serialization of the section, enables the copy button. */
  copyText?: string;
}) {
  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <CancelButton onClick={onCancel} disabled={saving} />
        <SaveButton onClick={onSave} disabled={saving} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {copyText && <CopyButton text={copyText} />}
      <EditButton onClick={onEdit} />
    </div>
  );
}

/** Shown in place of values that the parser left empty. */
export function EmptyValue({ children = "Not provided" }: { children?: string }) {
  return <span className="text-sm text-neutral-400 italic">{children}</span>;
}
