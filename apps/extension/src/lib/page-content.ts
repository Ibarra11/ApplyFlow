async function getActiveTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  if (!tab?.id) {
    throw new Error("No active tab to read from.");
  }

  const url = tab.url ?? "";
  if (/^(chrome|edge|about|chrome-extension):/.test(url)) {
    throw new Error("Can't read this page. Open the job posting first.");
  }

  return { tabId: tab.id, url };
}

/**
 * Returns the URL of the active browser tab, or throws if it can't be read.
 */
export async function getActiveTabUrl(): Promise<string> {
  const { url } = await getActiveTab();
  return url;
}

/**
 * Reads the visible text and URL of the active tab so the side panel can send
 * a whole job posting to the server without the user copy/pasting it by hand.
 */
export async function grabActivePage(): Promise<{ url: string; text: string }> {
  const { tabId, url } = await getActiveTab();

  let injection;
  try {
    [injection] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => document.body?.innerText ?? "",
    });
  } catch {
    throw new Error("Couldn't read the page. Try reloading it.");
  }

  const text =
    typeof injection?.result === "string" ? injection.result.trim() : "";
  if (!text) {
    throw new Error("That page didn't have any readable text.");
  }

  return { url, text };
}

/** @deprecated Prefer `grabActivePage()` when the tab URL is also needed. */
export async function grabActivePageText(): Promise<string> {
  const { text } = await grabActivePage();
  return text;
}
