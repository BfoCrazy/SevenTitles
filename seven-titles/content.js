export const config = {
  matches: ["https://www.youtube.com/watch*"]
}

let currentVideoId = null
let latestCaptions = null
let toggles = [];
let featureEnabled = false;

async function loadToggles() {
  const result = await chrome.storage.local.get("toggles");

  if (Array.isArray(result.toggles)) {
    toggles = result.toggles;
    featureEnabled = toggles.some(v => v);
  } else {
    featureEnabled = false;
  }

  console.log("Feature enabled?", featureEnabled);
}

loadToggles();

async function runForce() {
  const { toggles } = await chrome.storage.local.get("toggles");

  if (!Array.isArray(toggles) || !toggles.some(v => v)) {
    return;
  }

  await forceLoadCaptions();
}


function getVideoId() {
  const params = new URLSearchParams(window.location.search)
  return params.get("v")
}


function saveSubtitle(videoId, data) { //partial credits Alpine
  const key = videoId


  chrome.storage.local.get(null, (all) => {
    const entries = Object.entries(all)
      .filter(([k]) => !k.startsWith("_meta") && k !== "toggles")
      .sort((a, b) => (b[1].savedAt || 0) - (a[1].savedAt || 0))

    const trimmed = entries.slice(0, 15)

    const newStorage = {}

    trimmed.forEach(([k, v]) => {
      newStorage[k] = v
    })


    newStorage[key] = {
      data,
      savedAt: Date.now()
    }


    chrome.storage.local.set(newStorage, () => {

      chrome.runtime.sendMessage({
        type: "SUBTITLES_SAVED",
        videoId,
        payload: data
      })
    })
  })
}


function getSubtitle(videoId) { //partial credits Alpine
  return new Promise((resolve) => {
    chrome.storage.local.get(videoId, (result) => {
      resolve(result[videoId] || null)
    })
  })
}


function flickerCaptions() { //credits Alpine
  const btn = document.querySelector(".ytp-subtitles-button")
  if (!btn) return

  if (btn.getAttribute("aria-pressed") === "true") return

  btn.click()
  setTimeout(() => btn.click(), 120)
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function forceLoadCaptions() {
  const ccButton = document.querySelector(".ytp-subtitles-button")
  if (!ccButton) return

  const wasEnabled = ccButton.getAttribute("aria-pressed") === "true"




  if (!wasEnabled) {
    ccButton.click()
    await sleep(400)
  }


  const settingsBtn = document.querySelector(".ytp-settings-button")
  if (!settingsBtn) return

  settingsBtn.click()
  await sleep(300)

  const menuItems = Array.from(document.querySelectorAll(".ytp-menuitem"))

  const subtitlesItem = menuItems.find(item =>
    item.textContent.toLowerCase().includes("subtitles")
  )

  if (subtitlesItem) {
    subtitlesItem.click()
    await sleep(300)

    const tracks = Array.from(document.querySelectorAll(".ytp-menuitem"))

    const autoTrack = tracks.find(item =>
      item.textContent.toLowerCase().includes("auto")
    )

    if (autoTrack) {

      autoTrack.click()
      await sleep(300)
    }
  }


  document.body.click()


  if (!wasEnabled) {
    ccButton.click()
  }


  chrome.runtime.sendMessage({
     type: "reSub",
  })
}




async function initCaptions() {
  const videoId = getVideoId()
  if (!videoId) return


  if (videoId === currentVideoId) return

  currentVideoId = videoId
  latestCaptions = null



  const existing = await getSubtitle(videoId)

  if (existing) {

    latestCaptions = existing.data
    return
  }




  setTimeout(() => {
    runForce()
  }, 1500)

}


chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "AUTO_CAPTIONS") return

  const videoId = getVideoId()
  if (!videoId) return

  if (videoId !== currentVideoId) return



  try {
    const parsed = typeof msg.payload === "string"
      ? JSON.parse(msg.payload)
      : msg.payload

    latestCaptions = parsed

    saveSubtitle(videoId, parsed)

    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === "AUTO_CAPTIONS") {

        const videoId = getVideoId()
        if (!videoId) return

        latestCaptions = msg.payload

        saveSubtitle(videoId, msg.payload)


        chrome.runtime.sendMessage({
          type: "SUBTITLES_READY",
          videoId,
          payload: msg.payload
        })
      }
    })

  } catch (e) {
    console.error("Failed to parse captions:", e)
  }
})


initCaptions()


document.addEventListener("yt-navigate-finish", () => {
  setTimeout(initCaptions, 800)
})
