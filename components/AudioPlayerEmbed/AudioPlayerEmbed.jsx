import styles from "./AudioPlayerEmbed.module.css"
import { useState, useEffect } from "react"

export default function AudioPlayerEmbed({ playerEmbed, size }) {
  const [isClient, setIsClient] = useState(false)

  const embeds =
    playerEmbed?.length > 1 ? playerEmbed.split(",") : [playerEmbed]

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    isClient &&
    embeds?.length > 0 &&
    embeds[0] !== "Not a valid embed" &&
    embeds[0] !== "" &&
    playerEmbed !== null && (
      <section className={styles.embed}>
        <iframe
          style={{ border: 0, width: "100%" }}
          src={`https://bandcamp.com/EmbeddedPlayer/${
            embeds[0]
          }/size=${size}/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=none${
            embeds.length > 1 ? `/${embeds[1].trim()}` : "/"
          }/transparent=true/`}
          seamless
        ></iframe>
      </section>
    )
  )
}
