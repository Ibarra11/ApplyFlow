"use client";

import {
  APPLICATION_STATUSES,
  type Application,
  type ApplicationStatus,
} from "@applyflow/schema";
import {
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  MapPin,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  PAGE_SIZE,
  useApplications,
  type StatusFilter,
} from "@/lib/use-applications";
import { useDeleteApplication } from "@/lib/use-delete-application";
import { useUpdateApplicationStatus } from "@/lib/use-update-application-status";

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "Pending",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
};

const statusStyles: Record<ApplicationStatus, string> = {
  pending: "bg-amber-300",
  interviewing: "bg-sky-300",
  offer: "bg-lime-300",
  rejected: "bg-red-300",
};

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
  const { mutate, isPending } = useUpdateApplicationStatus();
  const { mutate: deleteApplication, isPending: isDeleting } =
    useDeleteApplication();

  function handleDelete() {
    const label = application.company ? `${title} at ${application.company}` : title;
    if (window.confirm(`Delete "${label}"? This can't be undone.`)) {
      deleteApplication(application.id);
    }
  }

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
        {application.location && (
          <p className="flex items-center gap-1.5 truncate text-sm text-neutral-600">
            <MapPin className="size-4 shrink-0" />
            {application.location}
          </p>
        )}
        <p className="font-mono text-xs tracking-wide text-neutral-500 uppercase tabular-nums">
          Applied {formatAppliedDate(application.dateApplied)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="relative">
          <select
            aria-label="Application status"
            disabled={isPending}
            value={application.status}
            onChange={(e) =>
              mutate({
                id: application.id,
                status: e.target.value as ApplicationStatus,
              })
            }
            className={`appearance-none border-2 border-neutral-900 py-1.5 pr-8 pl-3 font-mono text-xs font-bold tracking-wide text-neutral-900 uppercase shadow-[3px_3px_0_0_#171717] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 ${statusStyles[application.status]}`}
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
          {isPending ? (
            <Loader2 className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 animate-spin text-neutral-900" />
          ) : (
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-neutral-900" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete application"
            title="Delete application"
            className="inline-flex items-center gap-1.5 border-2 border-neutral-900 bg-white p-1.5 text-neutral-900 shadow-[3px_3px_0_0_#171717] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-red-200 hover:shadow-[5px_5px_0_0_#171717] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
          </button>

          <a
            href={application.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 border-2 border-neutral-900 bg-white px-3 py-1.5 font-mono text-xs font-bold tracking-wide text-neutral-900 uppercase shadow-[3px_3px_0_0_#171717] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-amber-100 hover:shadow-[5px_5px_0_0_#171717] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            <ExternalLink className="size-3.5" />
            Open
          </a>
        </div>
      </div>
    </li>
  );
}

const pagerButton =
  "inline-flex items-center gap-1 border-2 border-neutral-900 bg-white px-4 py-2 font-mono text-sm font-bold tracking-wide text-neutral-900 uppercase shadow-[4px_4px_0_0_#171717] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#171717] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_#171717]";

const filters: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  ...APPLICATION_STATUSES.map((status) => ({
    id: status,
    label: statusLabels[status],
  })),
];

function FilterBar({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onChange(filter.id)}
          className={`border-2 border-neutral-900 px-3 py-1 font-mono text-xs font-bold tracking-wide uppercase transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${
            value === filter.id
              ? "bg-neutral-900 text-yellow-50"
              : "bg-white text-neutral-700 hover:bg-neutral-100"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError, error, isPlaceholderData } = useApplications(
    page,
    filter,
    PAGE_SIZE,
    debouncedSearch,
  );

  function handleFilterChange(value: StatusFilter) {
    setFilter(value);
    setPage(1);
  }

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

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title or company…"
          aria-label="Search applications"
          className="w-full border-2 border-neutral-900 bg-white py-2 pr-3 pl-9 font-mono text-sm text-neutral-900 shadow-[4px_4px_0_0_#171717] placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        />
      </div>

      <FilterBar value={filter} onChange={handleFilterChange} />

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-sm text-neutral-600">
          <Loader2 className="size-5 animate-spin" />
          Loading applications…
        </div>
      ) : isError ? (
        <div className="border-2 border-neutral-900 bg-red-100 p-4 shadow-[5px_5px_0_0_#171717]">
          <p className="text-sm font-semibold text-red-800">
            {error instanceof Error
              ? error.message
              : `Couldn't load applications. Make sure the API is running on ${
                  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
                }.`}
          </p>
        </div>
      ) : total === 0 ? (
        <div className="border-2 border-dashed border-neutral-400 bg-white/60 p-10 text-center">
          <p className="text-sm text-neutral-600">
            {debouncedSearch
              ? `No applications matching "${debouncedSearch}".`
              : filter === "all"
                ? "No applications yet. Apply to a job from the extension and it'll show up here."
                : `No ${statusLabels[filter]} applications.`}
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
