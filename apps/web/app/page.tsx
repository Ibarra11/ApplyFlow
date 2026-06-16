"use client";

import {
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useState } from "react";

import { PAGE_SIZE, useApplications } from "@/lib/use-applications";
import type { Application } from "@applyflow/schema";

function formatAppliedDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ApplicationCard({ application }: { application: Application }) {
  const title = application.title ?? "Untitled role";

  return (
    <li className="flex items-start justify-between gap-4 border-2 border-neutral-900 bg-white p-4 shadow-[5px_5px_0_0_#171717]">
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="truncate text-base font-bold text-neutral-900">{title}</p>
        {application.company && (
          <p className="flex items-center gap-1.5 truncate text-sm text-neutral-600">
            <Building2 className="size-4 shrink-0" />
            {application.company}
          </p>
        )}
        <p className="font-mono text-xs tracking-wide text-neutral-500 uppercase tabular-nums">
          Applied {formatAppliedDate(application.dateApplied)}
        </p>
      </div>
      <a
        href={application.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex shrink-0 items-center gap-1.5 border-2 border-neutral-900 bg-amber-300 px-3 py-1.5 font-mono text-xs font-bold tracking-wide text-neutral-900 uppercase shadow-[3px_3px_0_0_#171717] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#171717] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
      >
        <ExternalLink className="size-3.5" />
        Open
      </a>
    </li>
  );
}

const pagerButton =
  "inline-flex items-center gap-1 border-2 border-neutral-900 bg-white px-4 py-2 font-mono text-sm font-bold tracking-wide text-neutral-900 uppercase shadow-[4px_4px_0_0_#171717] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#171717] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_#171717]";

export default function Home() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isPlaceholderData } = useApplications(
    page,
    PAGE_SIZE,
  );

  const applications = data?.applications ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <div className="inline-flex w-fit items-center gap-2 border-2 border-neutral-900 bg-neutral-900 px-3 py-1.5 shadow-[4px_4px_0_0_#bef264]">
          <span className="font-mono text-sm font-bold tracking-wide text-lime-300 uppercase">
            ApplyFlow
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-neutral-900">
          Applications
        </h1>
        <p className="text-sm text-neutral-600">
          Every job you&apos;ve tracked from the ApplyFlow extension.
        </p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-sm text-neutral-600">
          <Loader2 className="size-5 animate-spin" />
          Loading applications…
        </div>
      ) : isError ? (
        <div className="border-2 border-neutral-900 bg-red-100 p-4 shadow-[5px_5px_0_0_#171717]">
          <p className="text-sm font-semibold text-red-800">
            Couldn&apos;t load applications. Make sure the API is running on{" "}
            {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}.
          </p>
        </div>
      ) : total === 0 ? (
        <div className="border-2 border-dashed border-neutral-400 bg-white/60 p-10 text-center">
          <p className="text-sm text-neutral-600">
            No applications yet. Apply to a job from the extension and
            it&apos;ll show up here.
          </p>
        </div>
      ) : (
        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs font-bold tracking-wide text-neutral-500 uppercase">
              {total} application{total === 1 ? "" : "s"}
            </p>
            <p className="font-mono text-xs tracking-wide text-neutral-500 uppercase tabular-nums">
              Page {page} / {totalPages}
            </p>
          </div>

          <ul className="flex flex-col gap-4">
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </ul>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              className={pagerButton}
              disabled={page <= 1 || isPlaceholderData}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
              Prev
            </button>
            <button
              type="button"
              className={pagerButton}
              disabled={page >= totalPages || isPlaceholderData}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
