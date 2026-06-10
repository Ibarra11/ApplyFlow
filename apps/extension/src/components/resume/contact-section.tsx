import { useMemo } from "react";
import {
  GitBranch,
  Globe,
  Link2,
  Mail,
  Phone,
  User,
  type LucideIcon,
} from "lucide-react";

import type { Resume } from "@/lib/types";
import { useUpdateResume } from "@/lib/api/mutations/use-update-resume";
import { LabeledField, TextInput } from "./controls";
import { contactText } from "./copy-text";
import { InlineCopyButton } from "./copy";
import { EmptyValue, SectionActions, SectionCard } from "./section-card";
import { useEditable } from "./use-editable";

type ContactDraft = Pick<
  Resume,
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "linkedin"
  | "github"
  | "website"
>;

function toHref(value: string, kind: "url" | "mail" | "tel") {
  if (kind === "mail") return `mailto:${value}`;
  if (kind === "tel") return `tel:${value}`;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function ContactRow({
  icon: Icon,
  value,
  kind,
  label,
}: {
  icon: LucideIcon;
  value: string;
  kind: "url" | "mail" | "tel";
  label: string;
}) {
  return (
    <li className="flex items-center gap-2">
      <Icon className="size-3.5 shrink-0 stroke-neutral-500" />
      <a
        href={toHref(value, kind)}
        target={kind === "url" ? "_blank" : undefined}
        rel={kind === "url" ? "noreferrer" : undefined}
        className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-800 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-900"
      >
        {value}
      </a>
      <InlineCopyButton text={value} label={label} />
    </li>
  );
}

export function ContactSection({ resume }: { resume: Resume }) {
  const { mutate, isPending } = useUpdateResume();

  const current = useMemo(
    () => ({
      firstName: resume.firstName,
      lastName: resume.lastName,
      email: resume.email,
      phone: resume.phone,
      linkedin: resume.linkedin,
      github: resume.github,
      website: resume.website,
    }),
    [
      resume.firstName,
      resume.lastName,
      resume.email,
      resume.phone,
      resume.linkedin,
      resume.github,
      resume.website,
    ],
  );

  const { editing, draft, setDraft, start, cancel, save } = useEditable(
    current,
    (next) => {
      const normalized = Object.fromEntries(
        Object.entries(next).map(([key, value]) => [
          key,
          value?.trim() ? value.trim() : null,
        ]),
      ) as ContactDraft;
      mutate(normalized);
    },
  );

  const fullName = [resume.firstName, resume.lastName]
    .filter(Boolean)
    .join(" ");

  const rows: {
    icon: LucideIcon;
    value: string;
    kind: "url" | "mail" | "tel";
    label: string;
  }[] = [];
  if (resume.email)
    rows.push({
      icon: Mail,
      value: resume.email,
      kind: "mail",
      label: "Copy email",
    });
  if (resume.phone)
    rows.push({
      icon: Phone,
      value: resume.phone,
      kind: "tel",
      label: "Copy phone",
    });
  if (resume.linkedin)
    rows.push({
      icon: Link2,
      value: resume.linkedin,
      kind: "url",
      label: "Copy LinkedIn",
    });
  if (resume.github)
    rows.push({
      icon: GitBranch,
      value: resume.github,
      kind: "url",
      label: "Copy GitHub",
    });
  if (resume.website)
    rows.push({
      icon: Globe,
      value: resume.website,
      kind: "url",
      label: "Copy website",
    });

  return (
    <SectionCard
      label="Contact"
      icon={User}
      accentClassName="bg-lime-300"
      actions={
        <SectionActions
          editing={editing}
          onEdit={start}
          onSave={save}
          onCancel={cancel}
          saving={isPending}
          copyText={contactText(resume)}
        />
      }
    >
      {editing ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <LabeledField label="First name" htmlFor="firstName">
              <TextInput
                id="firstName"
                value={draft.firstName ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, firstName: e.target.value })
                }
              />
            </LabeledField>
            <LabeledField label="Last name" htmlFor="lastName">
              <TextInput
                id="lastName"
                value={draft.lastName ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, lastName: e.target.value })
                }
              />
            </LabeledField>
          </div>
          <LabeledField label="Email" htmlFor="email">
            <TextInput
              id="email"
              type="email"
              value={draft.email ?? ""}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            />
          </LabeledField>
          <LabeledField label="Phone" htmlFor="phone">
            <TextInput
              id="phone"
              type="tel"
              value={draft.phone ?? ""}
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            />
          </LabeledField>
          <LabeledField label="LinkedIn" htmlFor="linkedin">
            <TextInput
              id="linkedin"
              value={draft.linkedin ?? ""}
              onChange={(e) => setDraft({ ...draft, linkedin: e.target.value })}
            />
          </LabeledField>
          <LabeledField label="GitHub" htmlFor="github">
            <TextInput
              id="github"
              value={draft.github ?? ""}
              onChange={(e) => setDraft({ ...draft, github: e.target.value })}
            />
          </LabeledField>
          <LabeledField label="Website" htmlFor="website">
            <TextInput
              id="website"
              value={draft.website ?? ""}
              onChange={(e) => setDraft({ ...draft, website: e.target.value })}
            />
          </LabeledField>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            {fullName ? (
              <h2 className="min-w-0 truncate text-xl font-bold tracking-tight text-neutral-900">
                {fullName}
              </h2>
            ) : (
              <EmptyValue>Unnamed candidate</EmptyValue>
            )}
            {fullName && <InlineCopyButton text={fullName} label="Copy name" />}
          </div>
          {rows.length > 0 ? (
            <ul role="list" className="flex flex-col gap-1.5">
              {rows.map((row) => (
                <ContactRow
                  key={row.value}
                  icon={row.icon}
                  value={row.value}
                  kind={row.kind}
                  label={row.label}
                />
              ))}
            </ul>
          ) : (
            <EmptyValue>No contact details</EmptyValue>
          )}
        </div>
      )}
    </SectionCard>
  );
}
