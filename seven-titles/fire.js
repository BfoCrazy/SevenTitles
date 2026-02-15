export const config = {
  matches: ["https://www.youtube.com/watch*"]
}

let triggers = []
let triggerCooldowns = {}
let videoListenerAttached = false
let latestEvents = null


const WORDS = [
  { word: "foundation", image: chrome.runtime.getURL("assets/img/Foundation.png"), sound: chrome.runtime.getURL("assets/sfx/Foundation2.mp3"), enabled: false },
  { word: "visitor", image: chrome.runtime.getURL("assets/img/Visitor.png"), sound: chrome.runtime.getURL("assets/sfx/Visitor.mp3"), enabled: false },
  { word: "scientist", image: chrome.runtime.getURL("assets/img/Scientist.png"), sound: chrome.runtime.getURL("assets/sfx/Scientist.mp3"), enabled: false },
  { word: "paradigm", image: chrome.runtime.getURL("assets/img/Paradigm.png"), sound: chrome.runtime.getURL("assets/sfx/Paradigm.mp3"), enabled: false },
  { word: "origin", image: chrome.runtime.getURL("assets/img/Origin.png"), sound: chrome.runtime.getURL("assets/sfx/Origin.mp3"), enabled: false },
  { word: "imagined", image: chrome.runtime.getURL("assets/img/Imagined.png"), sound: chrome.runtime.getURL("assets/sfx/Imagined.mp3"), enabled: false },
  { word: "order", image: chrome.runtime.getURL("assets/img/Order.png"), sound: chrome.runtime.getURL("assets/sfx/Order.mp3"), enabled: false },
]


function updateToggles() {
  chrome.storage.local.get("toggles", (result) => {
    const toggles = result.toggles || []

    WORDS.forEach((w, i) => {
      const val = toggles[i]
      w.enabled = (typeof val === "string" ? val.trim().toLowerCase() === "true" : !!val)
    })




    if (latestEvents) {

      buildTriggers(latestEvents)
    }
  })
}


chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return
  if (!changes.toggles) return
  updateToggles()
})


function buildTriggers(events) {
  if (!Array.isArray(events)) return
  latestEvents = events

  triggers = []
  triggerCooldowns = {}

  events.forEach(e => {
    if (!e.segs || !Array.isArray(e.segs)) return

    e.segs.forEach(seg => {
      const word = (seg.utf8 || "").trim().toLowerCase()
      const matched = WORDS.find(w => {
        if (!w.enabled) return false
        const regex = new RegExp(`^${w.word.toLowerCase()}`, "i")
        return regex.test(word)
      })
      if (matched) {
        const t = (e.tStartMs + (seg.tOffsetMs || 0)) / 1000
        triggers.push({ time: t, word: matched.word, image: matched.image, sound: matched.sound })
        triggerCooldowns[t] = false

      }
    })
  })


}


function waitForVideo(callback) {
  const interval = setInterval(() => {
    const video = document.querySelector("video")
    if (video) {
      clearInterval(interval)

      callback(video)
    }
  }, 300)
}


function attachListener(video) {
  if (videoListenerAttached) return
  videoListenerAttached = true


  let lastTime = video.currentTime


  triggers.forEach(tObj => triggerCooldowns[tObj.time] = false)

  function checkFrame() {
    const current = video.currentTime
    const delta = current - lastTime

    triggers.forEach(tObj => {
      const t = tObj.time


      if (current < t && triggerCooldowns[t]) {
        triggerCooldowns[t] = false
      }


      if (!triggerCooldowns[t] && delta > 0 && delta < 2 && lastTime < t && current >= t) {
        triggerCooldowns[t] = true

        showImage(tObj.image)
        playSound(tObj.sound)
      }
    })

    lastTime = current
    requestAnimationFrame(checkFrame)
  }

  checkFrame()

  video.addEventListener("ended", () => {
    triggers.forEach(tObj => triggerCooldowns[tObj.time] = false)
    lastTime = 0

  })

  video.addEventListener("seeked", () => {
    lastTime = video.currentTime

  })
}


function showImage(src) {
  const img = document.createElement("img")
  img.src = src
  Object.assign(img.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100vw",
    height: "100vh",
    objectFit: "contain",
    zIndex: 9999,
    pointerEvents: "none",
    transition: "opacity 1s ease",
    opacity: "1"
  })

  document.body.appendChild(img)

  setTimeout(() => img.style.opacity = "0", 1000)
  setTimeout(() => img.remove(), 2000)
}


function playSound(src) {
  const audio = new Audio(src)
  audio.play()
}


chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SUBTITLES_READY") {

    buildTriggers(msg.payload.events)
    waitForVideo(attachListener)
  }


  if (msg.type === "SUBTITLES_SAVED") {

    buildTriggers(msg.payload.events)
    waitForVideo(attachListener)
  }
})



function loadFromStorage() {
  const videoId = new URLSearchParams(location.search).get("v")
  if (!videoId) return

  chrome.storage.local.get(videoId, result => {
    const stored = result[videoId]
    if (!stored?.data) return

    let parsed
    try { parsed = typeof stored.data === "string" ? JSON.parse(stored.data) : stored.data } catch {

      return
    }
    if (!parsed.events) return


    buildTriggers(parsed.events)
    waitForVideo(attachListener)
  })
}

loadFromStorage()


document.addEventListener("yt-navigate-finish", () => {

  triggers = []
  triggerCooldowns = {}
  videoListenerAttached = false
  loadFromStorage()
})


updateToggles()


chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "reSub") {
     updateToggles()
  }
})
