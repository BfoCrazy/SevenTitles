import { useState, useEffect } from "react"
import styles from "./popup.module.css"

import image from "~assets/visor.png"
import imageSO from "~assets/sPeaker.png"
import imageSB from "~assets/sBars.png"
const buzz = new Audio(chrome.runtime.getURL("assets/soundind.mp3"))

const toggleList = [
  "Foundation",
  "Visitor",
  "Scientist",
  "Paradigm",
  "Origin",
  "Imagined",
  "Order",
  "Nothing to see here"
]

export default function Popup() {
  const [volume, setVolume] = useState(50);
  const [hovered, setHovered] = useState(false);
  const [toggles, setToggles] = useState<boolean[]>(
    Array(toggleList.length).fill(false)
  )

function checkTab(callback: (isTarget: boolean) => void) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
      url: "*://*.youtube.com/watch*"
    },
    (tabs) => {
      callback(tabs.length > 0)
    }
  )
}


  useEffect(() => {
    const loadToggles = async () => {
      if (!chrome?.storage?.local) return

      const result = await chrome.storage.local.get("toggles")

      if (
        result.toggles &&
        result.toggles.length === toggleList.length
      ) {
        setToggles(result.toggles)
      }
    }

    loadToggles()
  }, [])

  useEffect(() => {
      chrome.storage.local.get("sliderVolume", (result) => {
        setVolume(result.sliderVolume ?? 100);
      });
    }, []);

  useEffect(() => {
    if (!chrome?.storage?.local) return
    chrome.storage.local.set({ toggles })
  }, [toggles])

  const handleToggle = (index: number) => {
    const updated = [...toggles]
    updated[index] = !updated[index]
    setToggles(updated)
  }

return (
  <div className={styles.container}>
    <div className={styles.overlayText}>
        <sub>Made by BfoCrazy ♡</sub>
      </div>
    <div className={styles.leftPanel}>
      <div className={styles.grid}>
        {toggleList.map((label, index) => (
          <button
            key={label}
            onClick={() => handleToggle(index)}
            className={`${styles.button} ${
              toggles[index] ? styles.active : ""
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
    <div className={styles.rightPanel}>
     <div className={styles.visor}>
      <div className={styles.rightTop}>

        <h2 className={styles.desc} onMouseEnter={() => setHovered(true)}
                                      onMouseLeave={() => setHovered(false)}> Each button enables the <br /> display of the selected <br />member's <br />corresponding <br />effect when <br />toggled. <br />Have fun! </h2>
        <h2> <span className={styles.title}> Seven Titles </span> <span className={styles.subtitle}> for YouTube </span></h2>
        <div className={styles.imagFouter}>
        <div className={styles.imagF}>
        <img className="img" src={image} style={{
                                             width: "100px",
                                             height: "auto",
                                             display: "block",
                                             margin: "0 auto",
                                             objectFit: "contain",
                                             backgroundColor: "transparent",
                                           }}/>

      </div>
      </div>
      </div>
        <div className={styles.sliderCon} style={{ opacity: hovered ? 0 : 1 }}>
             <input
               type="range"
               min="0"
               max="100"
               className={styles.slider}
               id="SoundS"
               value={volume}
               onChange={(e) => {
                   const value = Number(e.target.value);
                   setVolume(value);
                   chrome.storage.local.set({ sliderVolume: value });
                   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                     if (!tabs[0]?.id) return;

                     chrome.tabs.sendMessage(tabs[0].id, {
                       type: "SET_SLIDER_VOLUME",
                       volume: value
                     });

                   });
                 }}
                 onPointerUp={(e) => {

                    checkTab((isTarget) => {
                    if (isTarget) return

                        buzz.volume = volume / 100;
                        buzz.pause();
                        buzz.currentTime = 0;
                        buzz.play();
                        });
                      }}
             />

       </div>

        <div className={styles.soundIc} style={{ opacity: hovered ? 0 : 0.6 }}>
        <img className="soundIMG" src={imageSO} style={{
                                                          width: "25px",
                                                          height: "auto",
                                                          display: "block",
                                                          margin: "0 auto",
                                                          objectFit: "contain",
                                                          backgroundColor: "transparent",

                                                          opacity: 0.5 + (volume / 100) * 0.8
                                                        }}/>
         </div>
         <div className={styles.soundIcB} style={{ opacity: hovered ? 0 : 0.6 }}>
         <img className="soundIMG2" src={imageSB} style={{
                                                                  width: "25px",
                                                                  height: "auto",
                                                                  display: "block",
                                                                  top: "100",
                                                                  objectFit: "contain",
                                                                  backgroundColor: "transparent",

                                                                  opacity: 0 + (volume / 100) * 0.8
                                                                }}/>
      </div>
      </div>
    </div>
  </div>
)
