import { Briefcase } from "lucide-react";

import type { ResumeJob, Resume } from "@/lib/types";
import { useUpdateResume } from "@/lib/api/mutations/use-update-resume";
import {
  AddButton,
  LabeledField,
  LineListInput,
  RemoveButton,
  TextInput,
} from "./controls";
import { InlineCopyButton } from "./copy";
import { bulletsText, experienceText } from "./copy-text";
import { cleanList } from "./list-utils";
import { EmptyValue, SectionActions, SectionCard } from "./section-card";
import { useEditable } from "./use-editable";

function emptyJob(): ResumeJob {
  return {
    companyName: null,
    title: null,
    startDate: null,
    endDate: null,
    details: [],
  };
}

function nullable(value: string) {
  return value.trim() ? value.trim() : null;
}

export function ExperienceSection({ resume }: { resume: Resume }) {
  const { mutate, isPending } = useUpdateResume();
  const { editing, draft, setDraft, start, cancel, save } = useEditable(
    resume.jobs,
    (next) =>
      mutate({
        jobs: next.map((job) => ({
          companyName: nullable(job.companyName ?? ""),
          title: nullable(job.title ?? ""),
          startDate: nullable(job.startDate ?? ""),
          endDate: nullable(job.endDate ?? ""),
          details: cleanList(job.details),
        })),
      }),
  );

  const updateJob = (index: number, patch: Partial<ResumeJob>) => {
    setDraft(draft.map((job, i) => (i === index ? { ...job, ...patch } : job)));
  };

  return (
    <SectionCard
      label="Experience"
      icon={Briefcase}
      accentClassName="bg-sky-300"
      actions={
        <SectionActions
          editing={editing}
          onEdit={start}
          onSave={save}
          onCancel={cancel}
          saving={isPending}
          copyText={experienceText(resume.jobs)}
        />
      }
    >
      {editing ? (
        <div className="flex flex-col gap-3">
          {draft.map((job, index) => (
            <div
              key={index}
              className="flex flex-col gap-2.5 border-2 border-dashed border-neutral-400 bg-neutral-50 p-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[0.6875rem] font-bold tracking-wide text-neutral-500 uppercase">
                  Role {index + 1}
                </span>
                <RemoveButton
                  label={`Remove role ${index + 1}`}
                  onClick={() =>
                    setDraft(draft.filter((_, i) => i !== index))
                  }
                />
              </div>
              <LabeledField label="Title" htmlFor={`job-title-${index}`}>
                <TextInput
                  id={`job-title-${index}`}
                  value={job.title ?? ""}
                  onChange={(e) => updateJob(index, { title: e.target.value })}
                />
              </LabeledField>
              <LabeledField label="Company" htmlFor={`job-company-${index}`}>
                <TextInput
                  id={`job-company-${index}`}
                  value={job.companyName ?? ""}
                  onChange={(e) =>
                    updateJob(index, { companyName: e.target.value })
                  }
                />
              </LabeledField>
              <div className="grid grid-cols-2 gap-2">
                <LabeledField label="Start" htmlFor={`job-start-${index}`}>
                  <TextInput
                    id={`job-start-${index}`}
                    value={job.startDate ?? ""}
                    onChange={(e) =>
                      updateJob(index, { startDate: e.target.value })
                    }
                  />
                </LabeledField>
                <LabeledField label="End" htmlFor={`job-end-${index}`}>
                  <TextInput
                    id={`job-end-${index}`}
                    value={job.endDate ?? ""}
                    onChange={(e) =>
                      updateJob(index, { endDate: e.target.value })
                    }
                  />
                </LabeledField>
              </div>
              <LabeledField
                label="Details (one per line)"
                htmlFor={`job-details-${index}`}
              >
                <LineListInput
                  id={`job-details-${index}`}
                  rows={5}
                  value={job.details}
                  onChange={(details) => updateJob(index, { details })}
                  placeholder="Describe an accomplishment…"
                />
              </LabeledField>
            </div>
          ))}
          <AddButton onClick={() => setDraft([...draft, emptyJob()])}>
            Add role
          </AddButton>
        </div>
      ) : resume.jobs.length > 0 ? (
        <ol role="list" className="flex flex-col gap-4">
          {resume.jobs.map((job, index) => {
            return (
              <li key={index} className="border-l-2 border-neutral-900 pl-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="flex-1 text-sm font-bold text-neutral-900">
                    {job.title || "Untitled role"}
                  </h3>
                  {job.title && (
                    <InlineCopyButton
                      text={job.title}
                      label="Copy title"
                      className="mt-0.5"
                    />
                  )}
                </div>
                {job.companyName && (
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex-1 text-sm font-medium text-neutral-600">
                      {job.companyName}
                    </p>
                    <InlineCopyButton
                      text={job.companyName}
                      label="Copy company"
                      className="mt-0.5"
                    />
                  </div>
                )}
                {(job.startDate || job.endDate) && (
                  <div className="mt-0.5 flex flex-wrap gap-1.5">
                    {job.startDate && (
                      <span className="inline-flex items-center gap-1 border border-neutral-300 bg-neutral-50 py-0.5 pr-1 pl-2">
                        <p className="font-mono text-[0.625rem] font-semibold tracking-wide text-neutral-500 uppercase tabular-nums">
                          Start: {job.startDate}
                        </p>
                        <InlineCopyButton
                          text={job.startDate}
                          label="Copy start date"
                        />
                      </span>
                    )}
                    {job.endDate && (
                      <span className="inline-flex items-center gap-1 border border-neutral-300 bg-neutral-50 py-0.5 pr-1 pl-2">
                        <p className="font-mono text-[0.625rem] font-semibold tracking-wide text-neutral-500 uppercase tabular-nums">
                          End: {job.endDate}
                        </p>
                        <InlineCopyButton
                          text={job.endDate}
                          label="Copy end date"
                        />
                      </span>
                    )}
                  </div>
                )}
                {job.details.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-[0.6875rem] font-bold tracking-wide text-neutral-500 uppercase">
                        Bullets
                      </p>
                      <InlineCopyButton
                        text={bulletsText(job.details)}
                        label="Copy all bullets"
                      />
                    </div>
                    <ul
                      role="list"
                      className="flex list-disc flex-col gap-1 pl-4 marker:text-neutral-400"
                    >
                      {job.details.map((detail, i) => (
                        <li
                          key={i}
                          className="text-sm leading-snug text-neutral-700"
                        >
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <EmptyValue>No experience added</EmptyValue>
      )}
    </SectionCard>
  );
}
