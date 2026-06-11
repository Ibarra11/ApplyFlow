import {
  storedJobSchema,
  storedResumeSchema,
  type StoredJob,
  type StoredResume,
} from "@applyflow/schema";

export const PARSED_RESUME_KEY = "parsedResume";
export const PARSED_JOB_KEY = "parsedJob";

const CONSTANTS = {
  PARSED_RESUME_KEY,
  PARSED_JOB_KEY,
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
  getParsedJob: async (): Promise<StoredJob | null> => {
    const result = await chrome.storage.local.get(CONSTANTS.PARSED_JOB_KEY);
    const parsed = storedJobSchema.safeParse(result[CONSTANTS.PARSED_JOB_KEY]);
    return parsed.success ? parsed.data : null;
  },
  setParsedJob: async (parsedJob: StoredJob): Promise<void> => {
    await chrome.storage.local.set({
      [CONSTANTS.PARSED_JOB_KEY]: parsedJob,
    });
  },
};
