import { GraduationCap } from "lucide-react";

import type { ResumeEducation, Resume } from "@/lib/types";
import { useUpdateResume } from "@/lib/api/mutations/use-update-resume";
import {
  AddButton,
  LabeledField,
  LineListInput,
  RemoveButton,
  TextInput,
} from "./controls";
import { InlineCopyButton } from "./copy";
import { educationText } from "./copy-text";
import { cleanList } from "./list-utils";
import { EmptyValue, SectionActions, SectionCard } from "./section-card";
import { useEditable } from "./use-editable";

function emptyEducation(): ResumeEducation {
  return {
    schoolName: null,
    degree: null,
    location: null,
    startDate: null,
    endDate: null,
    details: null,
  };
}

function dateRange(start: string | null, end: string | null) {
  return [start, end].filter(Boolean).join(" – ");
}

function nullable(value: string) {
  return value.trim() ? value.trim() : null;
}

export function EducationSection({ resume }: { resume: Resume }) {
  const { mutate, isPending } = useUpdateResume();
  const { editing, draft, setDraft, start, cancel, save } = useEditable(
    resume.education,
    (next) =>
      mutate({
        education: next.map((item) => {
          const details = cleanList(item.details ?? []);
          return {
            schoolName: nullable(item.schoolName ?? ""),
            degree: nullable(item.degree ?? ""),
            location: nullable(item.location ?? ""),
            startDate: nullable(item.startDate ?? ""),
            endDate: nullable(item.endDate ?? ""),
            details: details.length > 0 ? details : null,
          };
        }),
      }),
  );

  const updateItem = (index: number, patch: Partial<ResumeEducation>) => {
    setDraft(
      draft.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  return (
    <SectionCard
      label="Education"
      icon={GraduationCap}
      accentClassName="bg-orange-300"
      actions={
        <SectionActions
          editing={editing}
          onEdit={start}
          onSave={save}
          onCancel={cancel}
          saving={isPending}
          copyText={educationText(resume.education)}
        />
      }
    >
      {editing ? (
        <div className="flex flex-col gap-3">
          {draft.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-2.5 border-2 border-dashed border-neutral-400 bg-neutral-50 p-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[0.6875rem] font-bold tracking-wide text-neutral-500 uppercase">
                  School {index + 1}
                </span>
                <RemoveButton
                  label={`Remove school ${index + 1}`}
                  onClick={() => setDraft(draft.filter((_, i) => i !== index))}
                />
              </div>
              <LabeledField label="School" htmlFor={`edu-school-${index}`}>
                <TextInput
                  id={`edu-school-${index}`}
                  value={item.schoolName ?? ""}
                  onChange={(e) =>
                    updateItem(index, { schoolName: e.target.value })
                  }
                />
              </LabeledField>
              <LabeledField label="Degree" htmlFor={`edu-degree-${index}`}>
                <TextInput
                  id={`edu-degree-${index}`}
                  value={item.degree ?? ""}
                  onChange={(e) =>
                    updateItem(index, { degree: e.target.value })
                  }
                />
              </LabeledField>
              <LabeledField label="Location" htmlFor={`edu-location-${index}`}>
                <TextInput
                  id={`edu-location-${index}`}
                  value={item.location ?? ""}
                  onChange={(e) =>
                    updateItem(index, { location: e.target.value })
                  }
                />
              </LabeledField>
              <div className="grid grid-cols-2 gap-2">
                <LabeledField label="Start" htmlFor={`edu-start-${index}`}>
                  <TextInput
                    id={`edu-start-${index}`}
                    value={item.startDate ?? ""}
                    onChange={(e) =>
                      updateItem(index, { startDate: e.target.value })
                    }
                  />
                </LabeledField>
                <LabeledField label="End" htmlFor={`edu-end-${index}`}>
                  <TextInput
                    id={`edu-end-${index}`}
                    value={item.endDate ?? ""}
                    onChange={(e) =>
                      updateItem(index, { endDate: e.target.value })
                    }
                  />
                </LabeledField>
              </div>
              <LabeledField
                label="Details (one per line)"
                htmlFor={`edu-details-${index}`}
              >
                <LineListInput
                  id={`edu-details-${index}`}
                  rows={3}
                  value={item.details ?? []}
                  onChange={(details) => updateItem(index, { details })}
                  placeholder="Honors, coursework, GPA…"
                />
              </LabeledField>
            </div>
          ))}
          <AddButton onClick={() => setDraft([...draft, emptyEducation()])}>
            Add school
          </AddButton>
        </div>
      ) : resume.education.length > 0 ? (
        <ol role="list" className="flex flex-col gap-4">
          {resume.education.map((item, index) => {
            const range = dateRange(item.startDate, item.endDate);
            const degreeLocation = [item.degree, item.location]
              .filter(Boolean)
              .join(" · ");
            return (
              <li key={index} className="border-l-2 border-neutral-900 pl-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="flex-1 text-sm font-bold text-neutral-900">
                    {item.schoolName || "School"}
                  </h3>
                  {item.schoolName && (
                    <InlineCopyButton
                      text={item.schoolName}
                      label="Copy school"
                      className="mt-0.5"
                    />
                  )}
                </div>
                {degreeLocation && (
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex-1 text-sm font-medium text-neutral-600">
                      {degreeLocation}
                    </p>
                    <InlineCopyButton
                      text={degreeLocation}
                      label="Copy degree"
                      className="mt-0.5"
                    />
                  </div>
                )}
                {range && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[0.6875rem] font-semibold tracking-wide text-neutral-500 tabular-nums">
                      {range}
                    </span>
                    <InlineCopyButton text={range} label="Copy dates" />
                  </div>
                )}
                {item.details && item.details.length > 0 && (
                  <ul
                    role="list"
                    className="mt-1.5 flex list-disc flex-col gap-1 pl-4 marker:text-neutral-400"
                  >
                    {item.details.map((detail, i) => (
                      <li
                        key={i}
                        className="text-sm leading-snug text-neutral-700"
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <EmptyValue>No education added</EmptyValue>
      )}
    </SectionCard>
  );
}
