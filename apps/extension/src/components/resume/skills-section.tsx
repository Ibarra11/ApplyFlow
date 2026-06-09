import { useMemo } from "react";
import { Wrench } from "lucide-react";

import type { Resume, ResumeSkillCategory, ResumeSkills } from "@/lib/types";
import { SKILL_CATEGORIES, emptySkills } from "@/lib/types";
import { useUpdateResume } from "@/lib/api/mutations/use-update-resume";
import { Chip, LabeledField, LineListInput } from "./controls";
import { InlineCopyButton } from "./copy";
import { skillsText } from "./copy-text";
import { cleanList } from "./list-utils";
import { EmptyValue, SectionActions, SectionCard } from "./section-card";
import { useEditable } from "./use-editable";

const chipAccent: Record<ResumeSkillCategory, string> = {
  languages: "bg-lime-200",
  frontend: "bg-sky-200",
  backend: "bg-violet-200",
  databasesSearch: "bg-orange-200",
  infrastructure: "bg-pink-200",
  aiEngineering: "bg-teal-200",
  other: "bg-neutral-100",
};

export function SkillsSection({ resume }: { resume: Resume }) {
  const { mutate, isPending } = useUpdateResume();
  const skills = useMemo(() => resume.skills ?? emptySkills(), [resume.skills]);

  const { editing, draft, setDraft, start, cancel, save } = useEditable(
    skills,
    (next) => {
      const cleaned = {} as ResumeSkills;
      for (const { key } of SKILL_CATEGORIES) {
        cleaned[key] = cleanList(next[key] ?? []);
      }
      mutate({ skills: cleaned });
    },
  );

  const populated = SKILL_CATEGORIES.filter(
    ({ key }) => (skills[key] ?? []).length > 0,
  );

  return (
    <SectionCard
      label="Skills"
      icon={Wrench}
      accentClassName="bg-pink-300"
      actions={
        <SectionActions
          editing={editing}
          onEdit={start}
          onSave={save}
          onCancel={cancel}
          saving={isPending}
          copyText={skillsText(skills)}
        />
      }
    >
      {editing ? (
        <div className="flex flex-col gap-3">
          {SKILL_CATEGORIES.map(({ key, label }) => (
            <LabeledField key={key} label={label} htmlFor={`skills-${key}`}>
              <LineListInput
                id={`skills-${key}`}
                rows={3}
                value={draft[key] ?? []}
                onChange={(next) => setDraft({ ...draft, [key]: next })}
                placeholder="One skill per line…"
              />
            </LabeledField>
          ))}
        </div>
      ) : populated.length > 0 ? (
        <div className="flex flex-col gap-3">
          {populated.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[0.6875rem] font-bold tracking-wide text-neutral-500 uppercase">
                  {label}
                </p>
                <InlineCopyButton
                  text={skills[key].join(", ")}
                  label={`Copy ${label}`}
                />
              </div>
              <ul role="list" className="flex flex-wrap gap-1.5">
                {skills[key].map((skill) => (
                  <li key={skill}>
                    <Chip className={chipAccent[key]}>{skill}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <EmptyValue>No skills added</EmptyValue>
      )}
    </SectionCard>
  );
}
