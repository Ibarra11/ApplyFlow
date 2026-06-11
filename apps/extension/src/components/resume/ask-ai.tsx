import { useState } from "react";
import { Loader2, MessageSquare } from "lucide-react";

import { useAnswerQuestion } from "@/lib/api/mutations/use-answer-question";
import { useParsedJob } from "@/lib/api/queries/use-parsed-job";
import type { Resume } from "@/lib/types";
import { TextArea } from "./controls";
import { CopyButton } from "./copy";
import { JobSection } from "./job-section";
import { SectionCard } from "./section-card";


export function AskAi({ resume }: { resume: Resume }) {
  const [question, setQuestion] = useState("");
  const { data: storedJob } = useParsedJob();
  const { mutate, data: answer, isPending, isError } = useAnswerQuestion();

  const trimmed = question.trim();
  const jobDescription = storedJob?.jobDescription;

  return (
    <div className="flex flex-col gap-4 p-4">
      <JobSection />

      <fieldset disabled={isPending}>
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!trimmed) return;
          mutate({
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

        {isError && (
          <p role="alert" className="text-sm font-medium text-red-700">
            Couldn't generate an answer. Try again.
          </p>
        )}

        <button
          type="submit"
          disabled={!trimmed}
          className="inline-flex items-center justify-center gap-2 border-2 border-neutral-900 bg-violet-400 px-4 py-2.5 font-mono text-sm font-bold tracking-wide text-neutral-900 uppercase shadow-[4px_4px_0_0_#171717] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#171717] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_#171717]"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 shrink-0 animate-spin" />
              Thinking…
            </>
          ) : (
            "Ask →"
          )}
        </button>
      </form>
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
    </div>
  );
}
