import type { StoredResume } from "./types";

const CONSTANTS = {
  PARSED_RESUME_KEY: "parsedResume",
} as const;

export const storage = {
  getParsedResume: async (): Promise<StoredResume | null> => {
    const result = await chrome.storage.local.get(CONSTANTS.PARSED_RESUME_KEY);
    return (result[CONSTANTS.PARSED_RESUME_KEY] as StoredResume) ?? null;
  },
  setParsedResume: async (parsedResume: StoredResume): Promise<void> => {
    await chrome.storage.local.set({
      [CONSTANTS.PARSED_RESUME_KEY]: parsedResume,
    });
  },
};
