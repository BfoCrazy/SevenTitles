export const config = {
  matches: ["https://www.youtube.com/watch*"]
}




chrome.webRequest.onCompleted.addListener(  // partial credits Alpine
  async (details) => {
    const url = details.url;


    if (!url.includes("api/timedtext")) return;


    if (!url.includes("kind=asr")) {

      return;
    }

    try {
      const res = await fetch(url);
      const text = await res.text();

      if (details.tabId >= 0) {
        chrome.tabs.sendMessage(details.tabId, {
          type: "AUTO_CAPTIONS",
          payload: text
       });
      }

    } catch (err) {
      console.error("Failed fetching captions:", err);
    }
  },
  {
    urls: ["https://www.youtube.com/api/timedtext*"]
  }
);

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "reSub") {

    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, msg)
      })
    })
  }
})

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "initUpdated") {

    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, msg)
      })
    })
  }
})

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SUBTITLES_SAVED") {

    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, msg)
      })
    })
  }
})

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.sendMessage(activeInfo.tabId, {
    type: "tabswitch"
  })
})

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== "local") return;

  const all = await chrome.storage.local.get(null);
  const keysminT = Object.keys(all).filter(k => k !== "toggles");
  const keys = await chrome.storage.local.get();
  const keysDated = Object.entries(keys)
    .filter(([_, item]) => item && typeof item.savedAt === "number")
    .map(([key, item]) => ({ key, savedAt: item.savedAt }));

  const oldest = keysDated
    .sort((a, b) => a.savedAt - b.savedAt)[0].key;

  if (keysminT.length > 15) { //clean over 15 captions except toggles

    await chrome.storage.local.remove(oldest);
  }
});
