import { Loader2, RefreshCw } from "lucide-react";

import { useParseResume } from "@/lib/api/mutations/use-parse-resume";

export function ReparseControl() {
  const { mutate: parseResume, isPending } = useParseResume();

  return (
    <label
      className="inline-flex cursor-pointer items-center gap-1.5 border-2 border-neutral-900 bg-white px-2.5 py-1.5 font-mono text-[0.6875rem] font-bold tracking-wide text-neutral-900 uppercase transition-all hover:-translate-y-0.5 hover:bg-violet-200 hover:shadow-[2px_2px_0_0_#171717] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-neutral-900 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
      aria-disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="size-3.5 shrink-0 animate-spin" />
      ) : (
        <RefreshCw className="size-3.5 shrink-0 stroke-neutral-900" />
      )}
      {isPending ? "Parsing…" : "Re-parse"}
      <input
        type="file"
        accept="application/pdf"
        disabled={isPending}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && file.type === "application/pdf") parseResume(file);
          e.target.value = "";
        }}
      />
    </label>
  );
}
