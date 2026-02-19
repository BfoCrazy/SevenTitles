import { useState, useEffect } from "react"
import styles from "./popup.module.css"

import image from "~assets/visor.png"

const toggleList = [
  "Foundation",
  "Visitor",
  "Scientist",
  "Paradigm",
  "Origin",
  "Imagined",
  "Order"
]



export default function Popup() {
  const [toggles, setToggles] = useState<boolean[]>(
    Array(toggleList.length).fill(false)
  )

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
        <sub>Made by BfoCrazy ♡</sub>
      </div>
    </div>
    <div className={styles.rightPanel}>
     <div className={styles.visor}>
      <div className={styles.rightTop}>

        <h2 className={styles.desc}> Each button enables the <br /> display of the selected <br />member's <br />corresponding <br />effect when <br />toggled. <br />Have fun! </h2>
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
      </div>
    </div>
  </div>
)
