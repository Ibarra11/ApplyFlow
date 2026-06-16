import { useState } from "react";
import { FileText, Loader2, MessageSquare } from "lucide-react";

import { useAnswerQuestion } from "@/lib/api/mutations/use-answer-question";
import { useGenerateCoverLetter } from "@/lib/api/mutations/use-generate-cover-letter";
import { useParsedJob } from "@/lib/api/queries/use-parsed-job";
import type { Resume } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { CoverLetterStyle } from "@applyflow/schema";
import { TextArea } from "./controls";
import { CopyButton } from "./copy";
import { SectionCard } from "./section-card";

const coverLetterStyles: { id: CoverLetterStyle; label: string }[] = [
  { id: "concise", label: "Concise" },
  { id: "technical", label: "Technical" },
  { id: "traditional", label: "Traditional" },
  { id: "startup", label: "Startup" },
];

export function AskAi({ resume }: { resume: Resume }) {
  const [question, setQuestion] = useState("");
  const [coverLetterStyle, setCoverLetterStyle] =
    useState<CoverLetterStyle>("concise");
  const { data: storedJob } = useParsedJob();
  const {
    mutate: askQuestion,
    data: answer,
    isPending: isAnswering,
    isError: isAnswerError,
    reset: resetAnswer,
  } = useAnswerQuestion();
  const {
    mutate: generateCoverLetter,
    data: coverLetter,
    isPending: isGeneratingCoverLetter,
    isError: isCoverLetterError,
    reset: resetCoverLetter,
  } = useGenerateCoverLetter();

  const trimmed = question.trim();
  const jobDescription = storedJob?.jobDescription;
  const isBusy = isAnswering || isGeneratingCoverLetter;

  return (
    <div className="flex flex-col gap-4 p-4">
      <fieldset disabled={isBusy}>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!trimmed) return;
            resetCoverLetter();
            askQuestion({
              question: trimmed,
              resume,
              jobDescription: jobDescription ?? undefined,
            });
          }}
        >
          <TextArea
            id="question"
            name="question"
            aria-label="Question for AI"
            rows={4}
            placeholder="Enter question from job application…"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {isAnswerError && (
            <p role="alert" className="text-sm font-medium text-red-700">
              Couldn't generate an answer. Try again.
            </p>
          )}

          <button
            type="submit"
            disabled={!trimmed}
            className="inline-flex items-center justify-center gap-2 border-2 border-neutral-900 bg-violet-400 px-4 py-2.5 font-mono text-sm font-bold tracking-wide text-neutral-900 uppercase shadow-[4px_4px_0_0_#171717] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#171717] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_#171717]"
          >
            {isAnswering ? (
              <>
                <Loader2 className="size-4 shrink-0 animate-spin" />
                Thinking…
              </>
            ) : (
              "Ask →"
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 border-t-2 border-dashed border-neutral-300 pt-6">
          <div>
            <h3 className="font-mono text-xs font-bold tracking-wide text-neutral-900 uppercase">
              Cover letter
            </h3>
            <p className="mt-1 text-sm text-neutral-600">
              Generate a tailored cover letter from your resume and parsed job
              posting.
            </p>
          </div>

          <fieldset>
            <legend className="mb-2 font-mono text-[0.6875rem] font-bold tracking-wide text-neutral-500 uppercase">
              Cover letter style
            </legend>
            <div className="flex flex-col gap-2">
              {coverLetterStyles.map(({ id, label }) => (
                <label
                  key={id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 border-2 border-neutral-900 px-3 py-2 transition-colors",
                    coverLetterStyle === id
                      ? "bg-emerald-200 shadow-[2px_2px_0_0_#171717]"
                      : "bg-white hover:bg-neutral-50",
                  )}
                >
                  <input
                    type="radio"
                    name="cover-letter-style"
                    value={id}
                    checked={coverLetterStyle === id}
                    onChange={() => setCoverLetterStyle(id)}
                    className="size-3.5 accent-neutral-900"
                  />
                  <span className="text-sm font-medium text-neutral-900">
                    {label}
                    {id === "concise" && (
                      <span className="ml-1 text-neutral-500">(default)</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {!jobDescription && (
            <p className="text-sm text-amber-800">
              Parse a job on the Job tab first to generate a cover letter.
            </p>
          )}

          {isCoverLetterError && (
            <p role="alert" className="text-sm font-medium text-red-700">
              Couldn't generate a cover letter. Try again.
            </p>
          )}

          <button
            type="button"
            disabled={!jobDescription}
            onClick={() => {
              if (!jobDescription) return;
              resetAnswer();
              generateCoverLetter({
                resume,
                jobDescription,
                style: coverLetterStyle,
              });
            }}
            className="inline-flex items-center justify-center gap-2 border-2 border-neutral-900 bg-emerald-400 px-4 py-2.5 font-mono text-sm font-bold tracking-wide text-neutral-900 uppercase shadow-[4px_4px_0_0_#171717] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#171717] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_#171717]"
          >
            {isGeneratingCoverLetter ? (
              <>
                <Loader2 className="size-4 shrink-0 animate-spin" />
                Writing…
              </>
            ) : (
              <>
                <FileText className="size-4 shrink-0" />
                Generate cover letter
              </>
            )}
          </button>
        </div>
      </fieldset>

      {answer && (
        <SectionCard
          label="Answer"
          icon={MessageSquare}
          accentClassName="bg-sky-300"
          actions={<CopyButton text={answer} />}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-neutral-700">
            {answer}
          </p>
        </SectionCard>
      )}

      {coverLetter && (
        <SectionCard
          label="Cover letter"
          icon={FileText}
          accentClassName="bg-emerald-300"
          actions={<CopyButton text={coverLetter} />}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-neutral-700">
            {coverLetter}
          </p>
        </SectionCard>
      )}
    </div>
  );
}
