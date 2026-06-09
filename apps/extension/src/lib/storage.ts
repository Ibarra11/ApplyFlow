const CONSTANTS = {
  PARSED_RESUME_KEY: "parsedResume",
};
export const storage = {
  getParsedResume: () => {
    return chrome.storage.local.get(CONSTANTS.PARSED_RESUME_KEY);
  },
  setParsedResume: (parsedResume: any) => {
    chrome.storage.local.set({ [CONSTANTS.PARSED_RESUME_KEY]: parsedResume });
  },
};
