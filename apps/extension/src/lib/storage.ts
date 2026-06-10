import { storedResumeSchema, type StoredResume } from "@applyflow/schema";

const CONSTANTS = {
  PARSED_RESUME_KEY: "parsedResume",
} as const;

export const storage = {
  getParsedResume: async (): Promise<StoredResume | null> => {
    const result = await chrome.storage.local.get(CONSTANTS.PARSED_RESUME_KEY);
    const parsed = storedResumeSchema.safeParse(
      result[CONSTANTS.PARSED_RESUME_KEY],
    );
    return parsed.success ? parsed.data : null;
  },
  setParsedResume: async (parsedResume: StoredResume): Promise<void> => {
    await chrome.storage.local.set({
      [CONSTANTS.PARSED_RESUME_KEY]: parsedResume,
    });
  },
};
