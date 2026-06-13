import { useState } from "react";
import { Terminal } from "lucide-react";

import type { StoredResume } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AskAi } from "./ask-ai";
import { JobMatch } from "./job-match";
import { JobView } from "./job-view";
import { ContactSection } from "./contact-section";
import { EducationSection } from "./education-section";
import { ExperienceSection } from "./experience-section";
import { ProjectsSection } from "./projects-section";
import { ReparseControl } from "./reparse-control";
import { SkillsSection } from "./skills-section";

type View = "resume" | "job" | "ask" | "match";

function formatUpdated(timestamp: number) {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const viewTabs = [
  { id: "resume" as const, label: "Resume" },
  { id: "job" as const, label: "Job" },
  { id: "ask" as const, label: "Ask AI" },
  { id: "match" as const, label: "Match" },
] as const;

const activeTabColors: Record<View, string> = {
  resume: "bg-lime-300 text-neutral-900",
  job: "bg-amber-300 text-neutral-900",
  ask: "bg-violet-300 text-neutral-900",
  match: "bg-sky-300 text-neutral-900",
};

function ViewToggle({
  view,
  onChange,
}: {
  view: View;
  onChange: (view: View) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Panel view"
      className="mt-3 flex border-2 border-neutral-900"
    >
      {viewTabs.map(({ id, label }, index) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={view === id}
          onClick={() => onChange(id)}
          className={cn(
            "flex-1 px-3 py-1.5 font-mono text-[0.6875rem] font-bold tracking-wide uppercase transition-colors focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-violet-600",
            index < viewTabs.length - 1 && "border-r-2 border-neutral-900",
            view === id
              ? activeTabColors[id]
              : "bg-white text-neutral-600 hover:bg-neutral-50",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function ResumeView({ stored }: { stored: StoredResume }) {
  const [view, setView] = useState<View>("resume");
  const { resume } = stored;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b-2 border-neutral-900 bg-yellow-50/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center">
          <div className="flex items-center gap-2 border-2 border-neutral-900 bg-neutral-900 px-3 py-1.5 shadow-[4px_4px_0_0_#bef264]">
            <Terminal className="size-4 shrink-0 stroke-lime-300" />
            <p className="font-mono text-sm font-bold tracking-wide text-lime-300 uppercase">
              ApplyFlow
            </p>
          </div>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </header>

      <div className={cn(view !== "resume" && "hidden")}>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="min-w-0 truncate text-xs font-medium text-neutral-600">
                {stored.name}
              </p>
              <p className="font-mono text-[0.625rem] tracking-wide text-neutral-500 uppercase tabular-nums">
                Updated {formatUpdated(stored.updatedAt)}
              </p>
            </div>
            <ReparseControl />
          </div>
          <ContactSection resume={resume} />
          <ExperienceSection resume={resume} />
          <ProjectsSection resume={resume} />
          <EducationSection resume={resume} />
          <SkillsSection resume={resume} />
        </div>
      </div>

      <div className={cn(view !== "job" && "hidden")}>
        <JobView />
      </div>

      <div className={cn(view !== "ask" && "hidden")}>
        <AskAi resume={resume} />
      </div>

      <div className={cn(view !== "match" && "hidden")}>
        <JobMatch resume={resume} />
      </div>
    </div>
  );
}
