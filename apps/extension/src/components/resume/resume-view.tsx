import { Terminal } from "lucide-react";

import type { StoredResume } from "@/lib/types";
import { ContactSection } from "./contact-section";
import { EducationSection } from "./education-section";
import { ExperienceSection } from "./experience-section";
import { ReparseControl } from "./reparse-control";
import { SkillsSection } from "./skills-section";
import { SummarySection } from "./summary-section";

function formatUpdated(timestamp: number) {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ResumeView({ stored }: { stored: StoredResume }) {
  const { resume } = stored;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b-2 border-neutral-900 bg-yellow-50/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 border-2 border-neutral-900 bg-lime-300 px-2.5 py-1">
            <Terminal className="size-3.5 shrink-0 stroke-neutral-900" />
            <p className="font-mono text-xs font-bold tracking-wide uppercase">
              ApplyFlow
            </p>
          </div>
          <ReparseControl />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-xs font-medium text-neutral-600">
            {stored.name}
          </p>
          <p className="shrink-0 font-mono text-[0.625rem] tracking-wide text-neutral-500 uppercase tabular-nums">
            Updated {formatUpdated(stored.updatedAt)}
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-4 p-4">
        <ContactSection resume={resume} />
        <SummarySection resume={resume} />
        <ExperienceSection resume={resume} />
        <EducationSection resume={resume} />
        <SkillsSection resume={resume} />
      </div>
    </div>
  );
}
