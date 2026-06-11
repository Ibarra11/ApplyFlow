import {
  answerQuestionResponseSchema,
  type Resume,
} from "@applyflow/schema";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function fetchAnswer(
  question: string,
  resume: Resume,
): Promise<string> {
  const res = await fetch(`${API_URL}/ai/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, resume }),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? "Could not generate an answer");
  }

  const { answer } = answerQuestionResponseSchema.parse(await res.json());
  return answer;
}
