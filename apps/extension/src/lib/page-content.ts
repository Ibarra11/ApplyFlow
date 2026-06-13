/**
 * Reads the visible text of the active tab so the side panel can send a whole
 * job posting to the server without the user copy/pasting it by hand.
 */
export async function grabActivePageText(): Promise<string> {
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

  let injection;
  try {
    [injection] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body?.innerText ?? "",
    });
  } catch {
    throw new Error("Couldn't read the page. Try reloading it.");
  }

  const text = typeof injection?.result === "string" ? injection.result.trim() : "";
  if (!text) {
    throw new Error("That page didn't have any readable text.");
  }

  return text;
}
