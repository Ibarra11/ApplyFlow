import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

function useCopy() {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  const copy = useCallback(async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard access can be denied; fail silently.
    }
  }, []);

  return { copied, copy };
}

/** Bordered copy button that matches the section header button styling. */
export function CopyButton({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const { copied, copy } = useCopy();

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className={cn(
        "inline-flex items-center gap-1 border-2 border-neutral-900 bg-white px-2 py-1 font-mono text-[0.6875rem] font-bold tracking-wide text-neutral-900 uppercase transition-all hover:-translate-y-0.5 hover:bg-sky-200 hover:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
        className,
      )}
    >
      {copied ? (
        <Check className="size-3 shrink-0 stroke-neutral-900" />
      ) : (
        <Copy className="size-3 shrink-0 stroke-neutral-900" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/** Compact icon-only copy button for copying an individual field value. */
export function InlineCopyButton({
  text,
  label,
  className,
}: {
  text: string;
  label: string;
  className?: string;
}) {
  const { copied, copy } = useCopy();

  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : label}
      onClick={() => copy(text)}
      className={cn(
        "relative inline-flex size-5 shrink-0 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
        className,
      )}
    >
      {copied ? (
        <Check className="size-3.5 stroke-lime-600" />
      ) : (
        <Copy className="size-3.5" />
      )}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
      />
    </button>
  );
}
