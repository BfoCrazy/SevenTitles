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
  if (msg.type === "SUBTITLES_SAVED") {

    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, msg)
      })
    })
  }
})

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== "local") return;

  const all = await chrome.storage.local.get(null);


  const keys = Object.keys(all).filter(k => k !== "toggles");

  if (keys.length > 15) { //clean over 15 captions except toggles
    await chrome.storage.local.remove(keys);
  }
});
