import { useEffect, useState } from "react";

import { getActiveTabUrl } from "@/lib/page-content";

export function useActiveTabUrl() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    function refresh() {
      getActiveTabUrl()
        .then(setUrl)
        .catch(() => setUrl(null));
    }

    function handleUpdated(
      _tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
    ) {
      if (changeInfo.url || changeInfo.status === "complete") {
        refresh();
      }
    }

    refresh();

    chrome.tabs.onActivated.addListener(refresh);
    chrome.tabs.onUpdated.addListener(handleUpdated);

    return () => {
      chrome.tabs.onActivated.removeListener(refresh);
      chrome.tabs.onUpdated.removeListener(handleUpdated);
    };
  }, []);

  return url;
}
