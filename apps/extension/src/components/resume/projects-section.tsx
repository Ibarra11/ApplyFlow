import { FolderGit2 } from "lucide-react";

import type { ResumeProject, Resume } from "@/lib/types";
import { useUpdateResume } from "@/lib/api/mutations/use-update-resume";
import {
  AddButton,
  LabeledField,
  LineListInput,
  RemoveButton,
  TextInput,
} from "./controls";
import { InlineCopyButton } from "./copy";
import { bulletsText, projectsText } from "./copy-text";
import { cleanList } from "./list-utils";
import { EmptyValue, SectionActions, SectionCard } from "./section-card";
import { useEditable } from "./use-editable";

function emptyProject(): ResumeProject {
  return {
    name: null,
    url: null,
    details: [],
  };
}

function nullable(value: string) {
  return value.trim() ? value.trim() : null;
}

export function ProjectsSection({ resume }: { resume: Resume }) {
  const { mutate, isPending } = useUpdateResume();
  const { editing, draft, setDraft, start, cancel, save } = useEditable(
    resume.projects,
    (next) =>
      mutate({
        projects: next.map((project) => ({
          name: nullable(project.name ?? ""),
          url: nullable(project.url ?? ""),
          details: cleanList(project.details),
        })),
      }),
  );

  const updateProject = (index: number, patch: Partial<ResumeProject>) => {
    setDraft(
      draft.map((project, i) => (i === index ? { ...project, ...patch } : project)),
    );
  };

  return (
    <SectionCard
      label="Projects"
      icon={FolderGit2}
      accentClassName="bg-emerald-300"
      actions={
        <SectionActions
          editing={editing}
          onEdit={start}
          onSave={save}
          onCancel={cancel}
          saving={isPending}
          copyText={projectsText(resume.projects)}
        />
      }
    >
      {editing ? (
        <div className="flex flex-col gap-3">
          {draft.map((project, index) => (
            <div
              key={index}
              className="flex flex-col gap-2.5 border-2 border-dashed border-neutral-400 bg-neutral-50 p-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[0.6875rem] font-bold tracking-wide text-neutral-500 uppercase">
                  Project {index + 1}
                </span>
                <RemoveButton
                  label={`Remove project ${index + 1}`}
                  onClick={() => setDraft(draft.filter((_, i) => i !== index))}
                />
              </div>
              <LabeledField label="Name" htmlFor={`project-name-${index}`}>
                <TextInput
                  id={`project-name-${index}`}
                  value={project.name ?? ""}
                  onChange={(e) =>
                    updateProject(index, { name: e.target.value })
                  }
                />
              </LabeledField>
              <LabeledField label="URL" htmlFor={`project-url-${index}`}>
                <TextInput
                  id={`project-url-${index}`}
                  value={project.url ?? ""}
                  onChange={(e) =>
                    updateProject(index, { url: e.target.value })
                  }
                />
              </LabeledField>
              <LabeledField
                label="Details (one per line)"
                htmlFor={`project-details-${index}`}
              >
                <LineListInput
                  id={`project-details-${index}`}
                  rows={4}
                  value={project.details}
                  onChange={(details) => updateProject(index, { details })}
                  placeholder="Describe what you built…"
                />
              </LabeledField>
            </div>
          ))}
          <AddButton onClick={() => setDraft([...draft, emptyProject()])}>
            Add project
          </AddButton>
        </div>
      ) : resume.projects.length > 0 ? (
        <ol role="list" className="flex flex-col gap-4">
          {resume.projects.map((project, index) => (
            <li key={index} className="border-l-2 border-neutral-900 pl-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="flex-1 text-sm font-bold text-neutral-900">
                  {project.name || "Untitled project"}
                </h3>
                {project.name && (
                  <InlineCopyButton
                    text={project.name}
                    label="Copy name"
                    className="mt-0.5"
                  />
                )}
              </div>
              {project.url && (
                <div className="flex items-start justify-between gap-2">
                  <p className="flex-1 text-sm font-medium break-all text-neutral-600">
                    {project.url}
                  </p>
                  <InlineCopyButton
                    text={project.url}
                    label="Copy URL"
                    className="mt-0.5"
                  />
                </div>
              )}
              {project.details.length > 0 && (
                <div className="mt-2 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-[0.6875rem] font-bold tracking-wide text-neutral-500 uppercase">
                      Bullets
                    </p>
                    <InlineCopyButton
                      text={bulletsText(project.details)}
                      label="Copy all bullets"
                    />
                  </div>
                  <ul
                    role="list"
                    className="flex list-disc flex-col gap-1 pl-4 marker:text-neutral-400"
                  >
                    {project.details.map((detail, i) => (
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
          ))}
        </ol>
      ) : (
        <EmptyValue>No projects added</EmptyValue>
      )}
    </SectionCard>
  );
}
