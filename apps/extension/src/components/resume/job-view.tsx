import { useState } from "react";
import { Briefcase, Loader2, ScanLine } from "lucide-react";

import { useParseJob } from "@/lib/api/mutations/use-parse-job";
import { useParsedJob } from "@/lib/api/queries/use-parsed-job";
import { grabActivePageText } from "@/lib/page-content";
import type { JobDescription } from "@applyflow/schema";
import { TextArea } from "./controls";
import { SectionCard } from "./section-card";

function formatJobSummary(job: JobDescription) {
  const role =
    [job.title, job.company].filter(Boolean).join(" at ") || "Job description";
  const meta = [job.location, job.employmentType].filter(Boolean).join(" · ");
  const counts = [
    job.responsibilities.length > 0 &&
      `${job.responsibilities.length} responsibilities`,
    job.requirements.length > 0 && `${job.requirements.length} requirements`,
    job.niceToHave.length > 0 && `${job.niceToHave.length} nice-to-haves`,
    job.skills.length > 0 && `${job.skills.length} skills`,
  ]
    .filter(Boolean)
    .join(" · ");

  return { role, meta, counts };
}

export function JobView() {
  const { data: stored } = useParsedJob();
  const { mutate: parseJob, isPending, isError } = useParseJob();
  const [text, setText] = useState("");
  const [grabbing, setGrabbing] = useState(false);
  const [grabError, setGrabError] = useState<string | null>(null);

  const trimmed = text.trim();
  const job = stored?.jobDescription;
  const summary = job ? formatJobSummary(job) : null;
  const busy = isPending || grabbing;

  async function handleGrab() {
    setGrabError(null);
    setGrabbing(true);
    try {
      const pageText = await grabActivePageText();
      parseJob(pageText);
    } catch (err) {
      setGrabError(
        err instanceof Error ? err.message : "Couldn't read the page.",
      );
    } finally {
      setGrabbing(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {summary && (
        <SectionCard label="Job" icon={Briefcase} accentClassName="bg-amber-300">
          <p className="text-sm font-semibold text-neutral-900">
            {summary.role}
          </p>
          {summary.meta && (
            <p className="mt-1 text-xs text-neutral-600">{summary.meta}</p>
          )}
          {summary.counts && (
            <p className="mt-1 font-mono text-[0.625rem] tracking-wide text-neutral-500 uppercase">
              {summary.counts}
            </p>
          )}
        </SectionCard>
      )}

      <div className="flex flex-col gap-3">
        <p className="text-sm leading-relaxed text-neutral-700">
          Open the job posting in your active tab, then grab the page so
          ApplyFlow can read it for you.
        </p>

        {grabError && (
          <p role="alert" className="text-sm font-medium text-red-700">
            {grabError}
          </p>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={handleGrab}
          className="inline-flex items-center justify-center gap-2 border-2 border-neutral-900 bg-amber-300 px-4 py-2.5 font-mono text-sm font-bold tracking-wide text-neutral-900 uppercase shadow-[4px_4px_0_0_#171717] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#171717] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_#171717]"
        >
          {grabbing ? (
            <>
              <Loader2 className="size-4 shrink-0 animate-spin" />
              Reading page…
            </>
          ) : (
            <>
              <ScanLine className="size-4 shrink-0" />
              Grab from page →
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="h-0.5 flex-1 bg-neutral-300" />
        <span className="font-mono text-[0.625rem] font-bold tracking-wide text-neutral-500 uppercase">
          Or paste manually
        </span>
        <span className="h-0.5 flex-1 bg-neutral-300" />
      </div>

      <fieldset disabled={busy}>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!trimmed) return;
            parseJob(trimmed, {
              onSuccess: () => setText(""),
            });
          }}
        >
          <TextArea
            id="job-description"
            name="job-description"
            aria-label="Job description"
            rows={5}
            placeholder="Paste job description from the posting…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {isError && (
            <p role="alert" className="text-sm font-medium text-red-700">
              Couldn't parse the job description. Try again.
            </p>
          )}

          <button
            type="submit"
            disabled={!trimmed || busy}
            className="inline-flex items-center justify-center gap-2 border-2 border-neutral-900 bg-white px-4 py-2.5 font-mono text-sm font-bold tracking-wide text-neutral-900 uppercase shadow-[4px_4px_0_0_#171717] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-amber-100 hover:shadow-[6px_6px_0_0_#171717] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_#171717]"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 shrink-0 animate-spin" />
                Parsing…
              </>
            ) : (
              "Parse JD →"
            )}
          </button>
        </form>
      </fieldset>
    </div>
  );
}
