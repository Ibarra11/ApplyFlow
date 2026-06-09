import { FileText } from "lucide-react";

import type { Resume } from "@/lib/types";
import { useUpdateResume } from "@/lib/api/mutations/use-update-resume";
import { TextArea } from "./controls";
import { EmptyValue, SectionActions, SectionCard } from "./section-card";
import { useEditable } from "./use-editable";

export function SummarySection({ resume }: { resume: Resume }) {
  const { mutate, isPending } = useUpdateResume();
  const { editing, draft, setDraft, start, cancel, save } = useEditable(
    resume.summary ?? "",
    (next) => mutate({ summary: next.trim() ? next.trim() : null }),
  );

  return (
    <SectionCard
      label="Summary"
      icon={FileText}
      accentClassName="bg-violet-300"
      actions={
        <SectionActions
          editing={editing}
          onEdit={start}
          onSave={save}
          onCancel={cancel}
          saving={isPending}
          copyText={resume.summary ?? ""}
        />
      }
    >
      {editing ? (
        <TextArea
          aria-label="Professional summary"
          rows={6}
          placeholder="A short professional summary…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      ) : resume.summary ? (
        <p className="text-sm leading-relaxed text-neutral-700">
          {resume.summary}
        </p>
      ) : (
        <EmptyValue>No summary yet</EmptyValue>
      )}
    </SectionCard>
  );
}
