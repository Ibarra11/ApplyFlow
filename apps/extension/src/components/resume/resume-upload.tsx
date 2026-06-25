import { useState } from "react";
import { FileText, Loader2, Terminal, Upload, X } from "lucide-react";

import { useParseResume } from "@/lib/api/mutations/use-parse-resume";
import { cn } from "@/lib/utils";

export function ResumeUpload() {
  const { mutate: parseResume, isPending, isError, error } = useParseResume();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const acceptFile = (next: File | null) => {
    if (next && next.type === "application/pdf") setFile(next);
  };

  return (
    <div className="flex min-h-dvh flex-col justify-center gap-6 p-5">
      <div className="flex w-fit items-center gap-2 border-2 border-neutral-900 bg-lime-300 px-3 py-1">
        <Terminal className="size-4 shrink-0 stroke-neutral-900" />
        <p className="font-mono text-sm font-bold tracking-wide uppercase">
          ApplyFlow
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight text-neutral-900">
          Dump your resume here.
        </h1>
        <p className="text-sm text-neutral-600">
          Drop a PDF and we'll break it into editable pieces.
        </p>
      </div>

      <label
        htmlFor="resume"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          acceptFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className={cn(
          "group flex cursor-pointer flex-col items-center gap-3 border-2 border-neutral-900 p-7 text-center shadow-[5px_5px_0_0_#171717] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#171717]",
          dragging ? "bg-lime-200" : "bg-white",
        )}
      >
        <Upload className="size-7 shrink-0 stroke-neutral-900" />
        <p className="font-mono text-base font-bold tracking-wide text-neutral-900 uppercase">
          Upload PDF
        </p>
        <p className="text-sm font-medium text-neutral-600">
          Click or drag a file
        </p>
        <input
          id="resume"
          name="resume"
          type="file"
          accept="application/pdf"
          onChange={(e) => acceptFile(e.target.files?.[0] ?? null)}
          className="sr-only"
        />
      </label>

      {file && (
        <div className="flex items-center justify-between gap-2 border-2 border-neutral-900 bg-white px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="size-4 shrink-0 stroke-neutral-900" />
            <p className="truncate text-sm font-medium text-neutral-800">
              {file.name}
            </p>
          </div>
          <button
            type="button"
            aria-label="Remove file"
            onClick={() => setFile(null)}
            className="relative inline-flex size-6 shrink-0 items-center justify-center text-neutral-500 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            <X className="size-4" />
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
            />
          </button>
        </div>
      )}

      {isError && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {error instanceof Error
            ? error.message
            : "Couldn't parse that file. Try a different PDF."}
        </p>
      )}

      <button
        type="button"
        disabled={!file || isPending}
        onClick={() => file && parseResume(file)}
        className="inline-flex items-center justify-center gap-2 border-2 border-neutral-900 bg-violet-400 px-4 py-2.5 font-mono text-sm font-bold tracking-wide text-neutral-900 uppercase shadow-[4px_4px_0_0_#171717] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#171717] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_#171717]"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 shrink-0 animate-spin" />
            Parsing…
          </>
        ) : (
          "Parse it →"
        )}
      </button>
    </div>
  );
}
