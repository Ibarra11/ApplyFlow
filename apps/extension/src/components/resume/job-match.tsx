import { Briefcase, Loader2, Target } from "lucide-react";

import { useMatchJob } from "@/lib/api/mutations/use-match-job";
import { useParsedJob } from "@/lib/api/queries/use-parsed-job";
import type { JobDescription, JobMatchResult, Resume } from "@/lib/types";
import { Chip } from "./controls";
import { SectionCard } from "./section-card";

function formatJobSummary(job: JobDescription) {
  const role =
    [job.title, job.company].filter(Boolean).join(" at ") || "Job description";
  const meta = [job.location, job.employmentType].filter(Boolean).join(" · ");
  return { role, meta };
}

function MatchList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="text-sm leading-relaxed text-neutral-700 before:mr-2 before:content-['•']"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function MatchResult({ match }: { match: JobMatchResult }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard label="Score" icon={Target} accentClassName="bg-sky-300">
        <p className="font-mono text-4xl font-bold tabular-nums text-neutral-900">
          {match.score}
          <span className="text-lg text-neutral-500">/10</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">
          {match.summary}
        </p>
      </SectionCard>

      {match.strengths.length > 0 && (
        <SectionCard
          label="Strengths"
          icon={Target}
          accentClassName="bg-lime-300"
        >
          <MatchList items={match.strengths} />
        </SectionCard>
      )}

      {match.missingSkills.length > 0 && (
        <SectionCard
          label="Missing skills"
          icon={Target}
          accentClassName="bg-red-200"
        >
          <div className="flex flex-wrap gap-1.5">
            {match.missingSkills.map((skill) => (
              <Chip key={skill} className="bg-red-100">
                {skill}
              </Chip>
            ))}
          </div>
        </SectionCard>
      )}

      {match.experienceGaps.length > 0 && (
        <SectionCard
          label="Experience gaps"
          icon={Target}
          accentClassName="bg-orange-200"
        >
          <MatchList items={match.experienceGaps} />
        </SectionCard>
      )}
    </div>
  );
}

export function JobMatch({ resume }: { resume: Resume }) {
  const { data: storedJob } = useParsedJob();
  const { mutate, data: match, isPending, isError } = useMatchJob();

  const jobDescription = storedJob?.jobDescription;

  if (!jobDescription) {
    return (
      <div className="p-4">
        <p className="text-sm text-neutral-600">
          No job description parsed yet. Go to the Job tab, grab the posting from
          the page, and parse it first.
        </p>
      </div>
    );
  }

  const summary = formatJobSummary(jobDescription);

  return (
    <div className="flex flex-col gap-4 p-4">
      <SectionCard label="Job" icon={Briefcase} accentClassName="bg-amber-300">
        <p className="text-sm font-semibold text-neutral-900">{summary.role}</p>
        {summary.meta && (
          <p className="mt-1 text-xs text-neutral-600">{summary.meta}</p>
        )}
      </SectionCard>

      <fieldset disabled={isPending}>
        <div className="flex flex-col gap-3">
          {isError && (
            <p role="alert" className="text-sm font-medium text-red-700">
              Couldn't generate a match. Try again.
            </p>
          )}

          <button
            type="button"
            disabled={isPending}
            onClick={() => mutate({ resume, jobDescription })}
            className="inline-flex items-center justify-center gap-2 border-2 border-neutral-900 bg-sky-300 px-4 py-2.5 font-mono text-sm font-bold tracking-wide text-neutral-900 uppercase shadow-[4px_4px_0_0_#171717] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#171717] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_#171717]"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 shrink-0 animate-spin" />
                Analyzing…
              </>
            ) : (
              "Check match →"
            )}
          </button>
        </div>
      </fieldset>

      {match && <MatchResult match={match} />}
    </div>
  );
}
